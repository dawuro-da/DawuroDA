import { NextResponse } from "next/server";
import {
  findUserByEmail,
  updateUserPassword,
  updateUserToken,
} from "@/db/user";
import bcrypt from "bcrypt";
import { afterReset } from "@/util/emailTemplate";
import { v4 } from "uuid";
import { hashPassword } from "@/util/hash";
import { transporter } from "@/services/nodemailer";

export async function POST(req: Request) {
  const { email, password } = await req.json();

  if (!email || !password)
    return NextResponse.json(
      {
        success: false,
        error: "password and email are required",
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
          error: "Unable to reset user password (password issue)",
        },
        { status: 500 }
      );

    const user = await findUserByEmail(email);
    if (user) {
      await updateUserPassword({
        email: email,
        newPassword: hashedPassword,
        passwordSalt: salt,
      });

      const html = afterReset({
        name: `${user.firstName} ${user.lastName}`,
      });

      const result = await transporter.sendMail({
        to: email,
        from: "miketesttest6@gmail.com",
        subject: "Gammoda Password Reset Requiest",
        text: html,
        html: html,
      });

      await updateUserToken({ userId: user.id, token: v4() });

      if (result) {
        return NextResponse.json(
          { success: true, value: result },
          { status: 200 }
        );
      }
    } else {
      return NextResponse.json(
        {
          success: false,
          error: "User doesn't exist",
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
