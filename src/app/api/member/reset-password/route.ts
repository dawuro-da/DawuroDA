import { NextResponse } from "next/server";
import bcrypt from "bcrypt";
import { v4 } from "uuid";
import { hashPassword } from "@/util/hash";
import {
  findMemberByEmail,
  findMemberByPhone,
  updateMemberPassword,
} from "@/db/member";

export async function POST(req: Request) {
  const { phone, email, password } = await req.json();

  if ((!phone && !email) || !password)
    return NextResponse.json(
      {
        success: false,
        error: "password and phone or email are required",
      },
      { status: 400 }
    );

  try {
    const saltRounds = 10;
    const salt = await bcrypt.genSalt(saltRounds);
    const hashedPassword = await hashPassword(password, salt);

    if (!hashedPassword)
      return NextResponse.json(
        {
          success: false,
          error: "Unable to reset member password (password issue)",
        },
        { status: 500 }
      );

    const member = phone
      ? await findMemberByPhone(phone)
      : await findMemberByEmail(email);

    if (member) {
      await updateMemberPassword({
        memberId: member.id,
        newPassword: hashedPassword,
        passwordSalt: salt,
      });

      return NextResponse.json(
        { success: true, value: "successfully updated" },
        { status: 200 }
      );
    } else {
      return NextResponse.json(
        {
          success: false,
          error: "member doesn't exist",
        },
        { status: 400 }
      );
    }
  } catch (err) {
    console.warn(err);
    return NextResponse.json(
      {
        success: false,
        error: "Unable to reset password",
      },
      { status: 500 }
    );
  }
}
