import { NextResponse } from "next/server";
import bcrypt from "bcrypt";
import { getServerSession } from "next-auth";
import { OPTIONS } from "@/util/authOptions";
import { MembershipType, UserRole } from "@prisma/client";
import {
  createIndividualMember,
  createInstitutionMember,
  findMemberByEmail,
  findMemberByPhone,
} from "@/db/member";
import prisma from "@/lib/prisma";
import { calculateNextDueDate } from "@/util/date";
import { generateMemberId } from "@/util/helper";
import { createContribution } from "@/db/contribution";

async function hashPassword(
  password: string,
  salt: string
): Promise<string | null> {
  try {
    return await bcrypt.hash(password, salt);
  } catch (error) {
    console.error(error);
    return null;
  }
}

export async function POST(req: Request) {
  const {
    email,
    phone,
    membershipLevel,
    contributionAmount,
    contributionSystem,
    hasPaid,
    region,
    city,
    zone,
    kebele,
    positionAtWork,
    paymentMeans,
    membershipType,
    firstName,
    lastName,
    gender,
    expertise,
    dateOfBirth,
    institutionName,
    headOrRepresentative,
    fieldOfWork,
    partnershipIdea,
    educationLevel,
    workPlace,
    profileImage,
    idNumber,
    branch,
  } = await req.json();

  const session = await getServerSession(OPTIONS);
  if (!session?.user?.id || session?.user.role === UserRole.Member ) {
    return NextResponse.json(
      { success: false, error: "Unauthorized user" },
      { status: 401 }
    );
  }

  const emailExist = Boolean(await findMemberByEmail(email));
  const phoneExist = Boolean(await findMemberByPhone(phone));

  if (emailExist) {
    return NextResponse.json(
      {
        success: false,
        error: "Email already exist",
      },
      { status: 409 }
    );
  } else if (phoneExist) {
    return NextResponse.json(
      {
        success: false,
        error: "Phone already exist",
      },
      { status: 409 }
    );
  } else {
    const saltRounds = 10;
    const salt = await bcrypt.genSalt(saltRounds);
    const hashedPassword = await hashPassword("dummyPassword", salt);

    if (!hashedPassword)
      return NextResponse.json(
        {
          success: false,
          error: "Unable to create member ( password issue)",
        },
        { status: 500 }
      );

    try {
      const memberId = generateMemberId();
      const date = new Date(Date.now());

      const sharedMember = {
        email,
        phone,
        membershipLevel,
        contributionSystem,
        hasPaid,
        region,
        city,
        zone,
        kebele,
        positionAtWork,
        paymentMeans,
        memberId,
        registeredBy: session.user?.id,
        contributionAmount: parseInt(contributionAmount),
        lastPaidAt: date.toISOString(),
        membershipType,
        nextDueDate: calculateNextDueDate({
          fromDate: date,
          contributionSystem,
        })?.toISOString(),
        password_hash: hashedPassword,
        password_salt: salt,
      };

      let result;
      if (membershipType === MembershipType.Individual) {
        result = await createIndividualMember({
          individualData: {
            ...sharedMember,
            firstName,
            lastName,
            gender,
            educationLevel,
            expertise,
            dateOfBirth,
            workPlace,
            profileImage: "/icons/cms.svg",
            idNumber,
            branch,
          },
        });
      } else if (membershipType === MembershipType.Company) {
        result = await createInstitutionMember({
          institutionData: {
            ...sharedMember,
            institutionName,
            headOrRepresentative,
            fieldOfWork,
            partnershipIdea,
          },
        });
      }

      if (result) {
        await createContribution({
          contributionSystem: result.contributionSystem,
          contributorId: result.id,
          amount: contributionAmount,
        });
        return NextResponse.json(
          { success: true, value: result },
          { status: 200 }
        );
      }
      return NextResponse.json(
        { success: false, error: "Unable to create member" },
        { status: 500 }
      );
    } catch (err) {
      console.warn(err);
      return NextResponse.json(
        {
          success: false,
          error: "Unable to create member",
        },
        { status: 500 }
      );
    }
  }
}
