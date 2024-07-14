import { NextResponse } from "next/server";
import { sendOTP } from "@/util/sms";
import { findMemberByEmail, findMemberByPhone } from "@/db/member";

export async function POST(req: Request) {
  try {
    const { phone, email } = await req.json();

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

    const response = await sendOTP({ phone });

    if (response.data.acknowledge === "success") {
      return NextResponse.json(
        {
          success: true,
          value: "Verifcation OTP sent",
        },
        { status: 200 }
      );
    } else {
      return NextResponse.json(
        {
          success: false,
          error: "Unable to send OTP",
        },
        { status: 500 }
      );
    }
  } catch (err) {
    console.warn(err);
    return NextResponse.json(
      {
        success: false,
        error: "Unable to send OTP",
      },
      { status: 500 }
    );
  }
}
