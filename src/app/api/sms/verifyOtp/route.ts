import { NextResponse } from "next/server";
import axios from "axios";

export async function POST(req: Request) {
  try {
    const { phone, code } = await req.json();

    const response = await axios.get(
      `https://api.afromessage.com/api/verify?to=${phone}&code=${code}`,
      {
        headers: {
          Authorization: "Bearer " + process.env.AFRO_AUTH_TOKEN,
        },
      }
    );

    if (response.data.acknowledge === "success") {
      return NextResponse.json(
        {
          success: true,
          value: "Successfully Verified",
        },
        { status: 200 }
      );
    } else {
      return NextResponse.json(
        {
          success: false,
          error: "Invalid OTP code",
        },
        { status: 200 }
      );
    }
  } catch (err) {
    console.warn(err);
    return NextResponse.json(
      {
        success: false,
        error: "Unable to verify OTP",
      },
      { status: 500 }
    );
  }
}
