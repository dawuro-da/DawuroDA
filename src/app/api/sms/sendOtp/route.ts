import { NextResponse } from "next/server";
import axios from "axios";

export async function POST(req: Request) {
  try {
    const { phone } = await req.json();

    const pr = "Here is your Gammoda sign up OTP";
    const response = await axios.get(
      `https://api.afromessage.com/api/challenge?
      from=${process.env.AFRO_IDENTIFIER_ID}&to=${phone}&ttl=300&pr=${pr}`,
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
