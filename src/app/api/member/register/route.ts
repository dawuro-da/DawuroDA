import { NextResponse } from "next/server";
import bcrypt from "bcrypt";
import { getServerSession } from "next-auth";
import { OPTIONS } from "../../auth/[...nextauth]/route";
import { MembershipType, UserRole } from "@prisma/client";
import {
  createMember,
  findMemberByEmail,
  findMemberByPhone,
} from "@/db/member";
import prisma from "@/lib/prisma";
import { calculateNextDueDate } from "@/util/date";
import { generateMemberId } from "@/util/helper";

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
    firstName,
    lastName,
    gender,
    registeredBy,
    email,
    phone,
    zone,
    city,
    contributionAmount,
    contributionSystem,
    hasPaid,
    membershipLevel,
    membershipType,
    region,
    companyName,
    dateOfBirth,
    expertise,
    kebele,
    positionAtWork,
  } = await req.json();

  const session = await getServerSession(OPTIONS);
  if (session?.user.role === UserRole.Member || !session?.user.id) {
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
      const memberId = await generateMemberId();
      const date = new Date(Date.now());
      const memberData = {
        memberId,
        firstName,
        lastName,
        gender,
        registeredBy,
        email,
        phone,
        zone,
        city,
        contributionAmount: parseInt(contributionAmount),
        contributionSystem,
        hasPaid,
        lastPaidAt: date.toISOString(),
        membershipType: MembershipType.Individual,
        membershipLevel,
        nextDueDate: calculateNextDueDate({
          fromDate: date,
          contributionSystem,
        })?.toISOString(),
        region,
        companyName,
        dateOfBirth,
        expertise,
        kebele,
        positionAtWork,
        password_hash: hashedPassword,
        password_salt: salt,
      };
      const result = await createMember(memberData);

      if (result) {
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
