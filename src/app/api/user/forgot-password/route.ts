import { NextResponse } from "next/server";
import { findUserByEmail, updateUserToken } from "@/db/user";
import { forgotPassword } from "@/util/emailTemplate";
import { v4 } from "uuid";
import { transporter } from "@/services/nodemailer";

export async function POST(req: Request) {
  const { email } = await req.json();

  try {
    const user = await findUserByEmail(email);
    const generatedToken = v4();
    if (user) {
      await updateUserToken({
        userId: user.id,
        token: generatedToken,
      });

      const html = forgotPassword({
        name: `${user.firstName} ${user.lastName}`,
        token: generatedToken,
      });

      const result = await transporter.sendMail({
        to: email,
        from: "miketesttest6@gmail.com",
        subject: "Gammoda Password Reset Requiest",
        text: html,
        html: html,
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
          error: "Unable to send message to your email",
        },
        { status: 500 }
      );
    }
    return NextResponse.json(
      {
        success: false,
        error: "User not found with this email",
      },
      { status: 400 }
    );
  } catch (err) {
    console.warn(err);
    return NextResponse.json(
      {
        success: false,
        error: "Unable to request forgot password",
      },
      { status: 500 }
    );
  }
}
