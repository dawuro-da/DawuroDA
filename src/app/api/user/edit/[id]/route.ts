import { NextResponse } from "next/server";
import { findByEmail, findByPhone, updateUser } from "@/db/user";
import { getServerSession } from "next-auth";
import { OPTIONS } from "@/app/api/auth/[...nextauth]/route";
import { UserRole } from "@prisma/client";

export async function POST(req: Request, context: { params: { id: string } }) {
  const session = await getServerSession(OPTIONS);
  if (!session?.user.id || session?.user.role === UserRole.Member) {
    return NextResponse.json(
      { success: false, error: "Unauthorized user" },
      { status: 401 }
    );
  }
  try {
    const userId = context.params.id;
    const { firstName, lastName, gender, email, phone } = await req.json();

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
    }
    if (phoneExist) {
      if (phoneExist.id !== userId) {
        return NextResponse.json(
          {
            success: false,
            error: "Phone already exist",
          },
          { status: 409 }
        );
      }
    }
    
    const result = await updateUser({
      firstName,
      lastName,
      gender,
      phone,
      email,
      userId,
    });

    if (result) {
      return NextResponse.json(
        { success: true, value: result },
        { status: 200 }
      );
    }
    return NextResponse.json(
      {
        success: false,
        error: "Unable to update user",
      },
      { status: 500 }
    );
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
