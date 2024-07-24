import { NextResponse } from "next/server";
import { findMemberByPhone } from "@/db/member";
import { sendOTP } from "@/util/sms";

export async function POST(req: Request) {
  const { phone } = await req.json();

  try {
    const member = await findMemberByPhone(phone);

    if (member) {
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
