import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { OPTIONS } from "@/util/authOptions";
import { creatSmsMessage } from "@/db/sms";
import axios from "axios";

export async function POST(req: Request) {
  const session = await getServerSession(OPTIONS);
  if (!session?.user?.id) {
    return NextResponse.redirect("/gaadmin/login", 401);
  }
  try {
    const { phones, message } = await req.json();

    const response = await axios.post(
      "https://api.afromessage.com/api/bulk_send",
      {
        to: [...phones],
        message: message,
        from: process.env.AFRO_IDENTIFIER_ID,
        campaign: "Gammoda",
      },
      {
        headers: {
          Authorization: "Bearer " + process.env.AFRO_AUTH_TOKEN,
        },
      }
    );

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
