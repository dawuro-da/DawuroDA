import { NextResponse } from "next/server";
import { sendOTP } from "@/util/sms";

export async function POST(req: Request) {
  try {
    const { phone } = await req.json();

    const response = await sendOTP({ phone });

    if (response.data.acknowledge === "success") {
      return NextResponse.json(
        {
          success: true,
          value: "Successfully Sent",
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
