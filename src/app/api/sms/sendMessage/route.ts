import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { OPTIONS } from "@/util/authOptions";
import { creatSmsMessage } from "@/db/sms";
import axios from "axios";

export async function POST(req: Request) {
  const session = await getServerSession(OPTIONS);
  if (!session?.user?.id) {
    return NextResponse.json(
      { success: false, error: "Unauthorized" },
      { status: 401 }
    );
  }
  try {
    const { phones, message } = await req.json();

    // Afromessage's bulk_send endpoint rejects anything under 2 recipients
    // (see the "recipients list is too small" error it returns) — checked
    // here too as a backstop for any caller that skips the UI's own guard,
    // with a clear message instead of relaying Afromessage's raw wording.
    if (!Array.isArray(phones) || phones.length < 2) {
      return NextResponse.json(
        {
          success: false,
          error:
            "At least 2 recipients are required — the SMS provider doesn't allow sending to a single recipient",
        },
        { status: 400 }
      );
    }

    const response = await axios.post(
      "https://api.afromessage.com/api/bulk_send",
      {
        to: [...phones],
        message: message,
        from: process.env.AFRO_IDENTIFIER_ID,
        sender: process.env.AFRO_SENDER_NAME,
        campaign: "DawuroDA",
      },
      {
        headers: {
          Authorization: "Bearer " + process.env.AFRO_AUTH_TOKEN,
        },
      }
    );

    // Afromessage responds with HTTP 200 even when it rejects the request
    // (invalid sender, unapproved identifier, too few recipients, etc.) —
    // the real result is in the response body, not the status code. Without
    // checking `acknowledge` here, a rejected send still looked like a
    // success to the admin who sent it.
    if (response.data?.acknowledge !== "success") {
      console.error("Afromessage bulk_send rejected:", response.data);
      return NextResponse.json(
        {
          success: false,
          error:
            response.data?.response?.errors?.[0] ??
            "Afromessage rejected the request",
        },
        { status: 502 }
      );
    }

    const result = await creatSmsMessage({
      message,
      totalPhones: phones.length,
    });

    if (result) {
      return NextResponse.json(
        { success: true, value: result },
        { status: 200 }
      );
    }
  } catch (err) {
    console.warn(err);
    return NextResponse.json(
      {
        success: false,
        error: "Unable to create user",
      },
      { status: 500 }
    );
  }
}
