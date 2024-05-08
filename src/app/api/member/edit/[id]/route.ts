import { NextResponse } from "next/server";
import { findByEmail, findByPhone, updateUser } from "@/db/user";
import { getServerSession } from "next-auth";
import { OPTIONS } from "@/app/api/auth/[...nextauth]/route";
import { updateMember } from "@/db/member";
import { UserRole } from "@prisma/client";

export async function POST(req: Request, context: { id: string }) {
  const id = context.id;
  const session = await getServerSession(OPTIONS);
  if (!session?.user.id) {
    return NextResponse.json(
      { success: false, error: "Unauthorized user" },
      { status: 401 }
    );
  }
  // if member he/she can only edit his/her own data
  if (session.user.role === UserRole.Member && session.user.id !== id) {
    return NextResponse.json(
      { success: false, error: "Unauthorized user" },
      { status: 401 }
    );
  }

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
    lastPaidAt,
    membershipLevel,
    membershipType,
    nextDueDate,
    region,
    companyName,
    dateOfBirth,
    expertise,
    kebele,
    positionAtWork,
  } = await req.json();

  const emailExist = await findByEmail(email);
  const phoneExist = await findByPhone(phone);

  if (emailExist) {
    if (emailExist.id !== id) {
      return NextResponse.json(
        {
          success: false,
          error: "Email already exist",
        },
        { status: 409 }
      );
    }
  } else if (phoneExist) {
    if (phoneExist.id !== id) {
      return NextResponse.json(
        {
          success: false,
          error: "Phone already exist",
        },
        { status: 409 }
      );
    }
  } else {
    try {
      const result = await updateMember({
        id,
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
        lastPaidAt,
        membershipLevel,
        membershipType,
        nextDueDate,
        region,
        companyName,
        dateOfBirth,
        expertise,
        kebele,
        positionAtWork,
      });

      if (result) {
        return NextResponse.json(
          { success: true, value: result },
          { status: 200 }
        );
      }
    } catch (err) {
      console.warn(err);
      return NextResponse.json(
        {
          success: false,
          error: "Unable to update member",
        },
        { status: 500 }
      );
    }
  }
}
