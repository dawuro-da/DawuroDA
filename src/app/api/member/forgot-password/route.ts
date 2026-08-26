import { NextResponse } from "next/server";
import { findMemberByEmail, findMemberByPhone } from "@/db/member";
import { sendOTP } from "@/util/sms";
import { transporter } from "@/services/nodemailer";
import { ConfirmationEmail } from "@/util/emailTemplate";
import { cookies } from "next/headers";

export async function POST(req: Request) {
  const { phone, email, international } = await req.json();

  try {
    const member = email
      ? await findMemberByEmail(email)
      : await findMemberByPhone(phone);

    if (member) {
      if (international) {
        const OTP = Math.floor(1000 + Math.random() * 9000);

        cookies().set("memberAuthOTP", `${OTP}`, { secure: true });

        const html = ConfirmationEmail({
          email: email,
          OTP: `${OTP}`,
        });

        const response = await transporter.sendMail({
          to: email,
          from: process.env.NODEMAIL_EMAIL,
          subject: "DawuroDA OTP Confirmation",
          text: html,
          html: html,
        });

        if (response) {
          return NextResponse.json(
            {
              success: true,
              value: "Verifcation OTP sent",
            },
            { status: 200 }
          );
        }
      } else {
        const result = await sendOTP({ phone });

        if (result.data.acknowledge === "success") {
          return NextResponse.json(
            { success: true, value: "Successfully sent" },
            { status: 200 }
          );
        }

        return NextResponse.json(
          {
            success: false,
            error: "Unable to send forgot password OTP",
          },
          { status: 500 }
        );
      }
    }
    return NextResponse.json(
      {
        success: false,
        error: "Member doesn't exist",
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
