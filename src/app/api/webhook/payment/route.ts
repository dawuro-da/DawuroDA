import { NextResponse } from "next/server";
import {
  deleteTempMemberByPhone,
  findTempMemberByPhone,
} from "@/db/tempMember";
import { generateMemberId } from "@/util/helper";
import { calculateNextDueDate } from "@/util/date";
import prisma from "@/lib/prisma";
import { createContribution } from "@/db/contribution";
import { Auction, Member, TempMember } from "@prisma/client";
import { findMemberByPhone } from "@/db/member";
import { createDonation } from "@/db/donation";
import { findAuctionById } from "@/db/auction";

export async function POST(req: Request, res: any) {
  try {
    const body = await req.json();
    const {
      event,
      email,
      mobile,
      meta,
      amount,
      first_name,
      last_name,
      fullName,
      type,
    } = body;

    if (event === "charge.success" && type === "API") {
      const { paymentType, auctionId } = JSON.parse(meta);

      if (paymentType === "registrationPayment") {
        const tempMember = await findTempMemberByPhone(mobile);
        if (tempMember) {
          await registerNewPaidMember(tempMember);
        }
      } else if (paymentType === "contributionPayment") {
        const member = await findMemberByPhone(mobile);
        if (member) {
          await addNewContribution(member);
        }
      } else if (paymentType === "auctionPayment") {
        const member = await findMemberByPhone(mobile);
        const auction = auctionId && (await findAuctionById(auctionId));
        if (member) {
          await addNewBidder({ member, auction });
        }
      }
    } else if (event === "charge.success" && type === "Donation") {
      await createANewDonation({
        amount: amount,
        donationDesignation: "",
        fullName: `${first_name} ${last_name && last_name}`,
        phone: mobile,
      });
    }

    return NextResponse.json(
      {
        success: "OK",
      },
      { status: 200 }
    );
  } catch (error) {
    console.warn({ error });
    return NextResponse.json(
      {
        success: "Can't process payment",
      },
      { status: 500 }
    );
  }
}
const createANewDonation = async ({
  amount,
  donationDesignation,
  fullName,
  phone,
}: {
  amount: string;
  donationDesignation: string;
  fullName: string;
  phone: string;
}) => {
  return await createDonation({ amount, donationDesignation, fullName, phone });
};

const addNewContribution = async (member: Member) => {
  const contribution = await createContribution({
    contributionSystem: member.contributionSystem,
    contributorId: member.id,
    amount: member.contributionAmount.toString(),
  });

  return contribution;
};

const addNewBidder = async ({
  member,
  auction,
}: {
  member: Member;
  auction: Auction;
}) => {
  const bidder = await prisma.bidder.create({
    data: {
      fullName: member.firstName
        ? `${member.firstName} ${member.lastName}`
        : `${member.institutionName}`,
      memberId: member.id,
      offer: 0,
      auctionId: auction.id,
      hasPaidCPO: true,
      hasPaidNRP: true,
    },
  });

  return bidder;
};

const registerNewPaidMember = async (tempMember: TempMember) => {
  const date = new Date(Date.now());
  const sharedData = {
    email: tempMember.email,
    phone: tempMember.phone,
    membershipLevel: tempMember.membershipLevel,
    contributionSystem: tempMember.contributionSystem,
    hasPaid: true,
    membershipType: tempMember.membershipType,
    region: tempMember.region,
    city: tempMember.city,
    zone: tempMember.zone,
    kebele: tempMember.kebele,
    positionAtWork: tempMember.positionAtWork,
    paymentMeans: tempMember.paymentMeans,
    contributionAmount: tempMember.contributionAmount,
    lastPaidAt: date.toISOString(),
    nextDueDate: calculateNextDueDate({
      fromDate: date,
      contributionSystem: tempMember.contributionSystem,
    })?.toISOString(),
    password_hash: tempMember.password_hash,
    password_salt: tempMember.password_salt,
  };

  const member = await prisma.member.create({
    data: {
      ...sharedData,
      memberId: generateMemberId(),
      firstName: tempMember.firstName,
      lastName: tempMember.lastName,
      gender: tempMember.gender,
      educationLevel: tempMember.educationLevel,
      expertise: tempMember.expertise,
      dateOfBirth: tempMember.dateOfBirth,
      workPlace: tempMember.workPlace,
      profileImage: tempMember.profileImage,
      idNumber: tempMember.idNumber,
      branch: tempMember.branch,
      institutionName: tempMember.institutionName,
      headOrRepresentative: tempMember.headOrRepresentative,
      fieldOfWork: tempMember.fieldOfWork,
      partnershipIdea: tempMember.partnershipIdea,
    },
  });

  if (member) {
    await deleteTempMemberByPhone({ phone: tempMember.phone });
    await createContribution({
      contributionSystem: member.contributionSystem,
      contributorId: member.id,
      amount: member.contributionAmount.toString(),
    });
  } else {
    return null;
  }
  return member;
};
