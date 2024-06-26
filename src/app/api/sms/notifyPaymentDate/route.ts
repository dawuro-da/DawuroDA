import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { OPTIONS } from "@/util/authOptions";
import { creatSmsMessage } from "@/db/sms";
import axios from "axios";
import { fetchMembersWithUpcomingPayments } from "@/db/member";

export async function GET(req: Request) {
  const session = await getServerSession(OPTIONS);
  if (!session?.user?.id) {
    return NextResponse.redirect("/gaadmin/login", 401);
  }
  try {
    const members = await fetchMembersWithUpcomingPayments();
    const phones = members.map((member) => member.phone);
    const message = ` Hello, 
            your payment is due. Please pay soon to avoid service disruption. 
            thank you!`;

    if (phones.length) {
      await axios.post(
        "https://api.afromessage.com/api/bulk_send",
        {
          to: [...phones],
          message: message,
          from: process.env.AFRO_IDENTIFIER_ID,
          campaign: "Contribution Due",
        },
        {
          headers: {
            Authorization: "Bearer " + process.env.AFRO_AUTH_TOKEN,
          },
        }
      );

      await creatSmsMessage({
        message: message,
        totalPhones: phones.length,
      });
    }

    return NextResponse.json({ success: true, value: "OK" }, { status: 200 });
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
