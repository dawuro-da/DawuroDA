import { NextResponse } from "next/server";
import {  findByEmail, findByPhone, updateUser } from "@/db/user";
import { getServerSession } from "next-auth";
import { OPTIONS } from "@/app/api/auth/[...nextauth]/route";


export async function POST(req: Request, context: { id: string }) {
  const session = await getServerSession(OPTIONS);
  if (!session?.user.id) {
    return NextResponse.json(
      { success: false, error: "Unauthorized user" },
      { status: 401 }
    );
  }

  const userId = context.id;
  const {
    firstName,
    lastName,
    role,
    gender,
    userName,
    email,
    phone,
    isApproved,
    approvedBy,
  } = await req.json();

  const emailExist = await findByEmail(email);
  const phoneExist = await findByPhone(phone);

  if (emailExist) {
    if (emailExist.id !== userId) {
      return NextResponse.json(
        {
          success: false,
          error: "Email already exist",
        },
        { status: 409 }
      );
    }
  } else if (phoneExist) {
    if (phoneExist.id !== userId) {
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
      const result = await updateUser({
        firstName,
        lastName,
        role,
        gender,
        userName,
        phone,
        email,
        userId,
        isApproved,
        approvedBy,
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
          error: "Unable to update user",
        },
        { status: 500 }
      );
    }
  }
}
