import { NextResponse } from "next/server";
import {
  deleteTempMemberByPhone,
  findTempMemberByPhone,
} from "@/db/tempMember";
import { generateMemberId } from "@/util/helper";
import { calculateNextDueDate, getEthiopianYear } from "@/util/date";
import prisma from "@/lib/prisma";
import { createContribution } from "@/db/contribution";
import { Auction, Member, TempMember } from "@prisma/client";
import { findMemberByPhone, renewMemberID } from "@/db/member";
import { createDonation } from "@/db/donation";
import { findAuctionById } from "@/db/auction";

// Chapa pings this URL to check reachability when the webhook is
// registered/saved in the dashboard, before it ever sends a real POST
// event. Without a GET handler, Next.js returns 405 for that check.
export async function GET() {
  return NextResponse.json({ success: "OK" }, { status: 200 });
}

export async function POST(req: Request, res: any) {
  try {
    const body = await req.json();
    const { event, mobile, meta, amount, first_name, type } = body;

    if (event === "charge.success" && type === "API") {
      const metaData = JSON.parse(JSON.stringify(meta));
      
      const paymentType = metaData?.paymentType ?? "";
      const auctionId = metaData?.auctionId ?? "";
      const donationDesignation = metaData?.donationDesignation ?? "";
      const branch = metaData?.branch ?? "";
      const phone_number = metaData?.phone_number ?? mobile;
      const campaignId = metaData?.campaignId || undefined;

      if (paymentType === "registrationPayment") {
        const tempMember = await findTempMemberByPhone(phone_number);
        if (tempMember) {
          await registerNewPaidMember(tempMember);
        }
      } else if (paymentType === "contributionPayment") {
        const member = await findMemberByPhone(phone_number);
        if (member) {
          await addNewContribution(member, amount);
        }
      } else if (paymentType === "auctionPayment") {
        const member = await findMemberByPhone(phone_number);
        const auction = auctionId && (await findAuctionById(auctionId));
        if (member) {
          await addNewBidder({ member, auction });
        }
      } else if (paymentType === "donationPayment")
        await createANewDonation({
          amount: amount,
          branch: branch,
          donationDesignation: donationDesignation,
          fullName: `${first_name ?? "Unknown"}`,
          phone: phone_number,
          campaignId,
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
  branch,
  campaignId,
}: {
  amount: string;
  donationDesignation: string;
  fullName: string;
  phone: string;
  branch: string;
  campaignId?: string;
}) => {
  return await createDonation({
    amount,
    donationDesignation,
    fullName,
    phone,
    branch,
    campaignId,
  });
};

const addNewContribution = async (member: Member, amount: string) => {
  const contribution = await createContribution({
    contributionSystem: member.contributionSystem,
    contributorId: member.id,
    amount: amount.toString(),
  });

  const nextDueDate = calculateNextDueDate({
    fromDate: member.nextDueDate,
    contributionSystem: member.contributionSystem,
  });

  await prisma.member.update({
    where: {
      id: member.id,
    },
    data: { nextDueDate },
  });
  await renewMemberID({ memberId: member.id, ethiopianYear: getEthiopianYear() });

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
      country: tempMember.country,
      nationality: tempMember.nationality,
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
