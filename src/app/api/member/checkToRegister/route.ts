import { NextResponse } from "next/server";
import { sendOTP } from "@/util/sms";
import { findMemberByEmail, findMemberByPhone } from "@/db/member";
import { transporter } from "@/services/nodemailer";
import { ConfirmationEmail } from "@/util/emailTemplate";
import { cookies } from "next/headers";

export async function POST(req: Request) {
  try {
    const { phone, email, isInternational } = await req.json();

    const emailExist = email ? Boolean(await findMemberByEmail(email)) : "";
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
    }

    if (isInternational) {
      const OTP = Math.floor(1000 + Math.random() * 9000);

      cookies().set("memberAuthOTP", `${OTP}`, { secure: true });

      const html = ConfirmationEmail({
        email: email,
        OTP: `${OTP}`,
      });

      const response = await transporter.sendMail({
        to: email,
        from: "miketesttest6@gmail.com",
        subject: "Gammoda OTP Confirmation",
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
      const response = await sendOTP({ phone });
      if (response.data.acknowledge === "success") {
        return NextResponse.json(
          {
            success: true,
            value: "Verifcation OTP sent",
          },
          { status: 200 }
        );
      }
    }

    return NextResponse.json(
      {
        success: false,
        error: "Unable to send OTP",
      },
      { status: 500 }
    );
  } catch (err) {
    console.error(err);
    return NextResponse.json(
      {
        success: false,
        error: "Unable to send OTP",
      },
      { status: 500 }
    );
  }
}
