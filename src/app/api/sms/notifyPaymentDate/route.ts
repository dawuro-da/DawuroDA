import { NextResponse } from "next/server";
import { creatSmsMessage } from "@/db/sms";
import axios from "axios";
import cron from "node-cron";
import {
  fetchMembersWithUpcomingPayments,
  updateMembersPaymentStatus,
} from "@/db/member";
import { getServerSession } from "next-auth";
import { OPTIONS } from "@/util/authOptions";

// the cron job will be initialized
const initializeCronJob = async (userId: string) => {
  try {
    const members = await fetchMembersWithUpcomingPayments();
    const message = ` Hello,
              your payment is due. Please pay soon to avoid service disruption.
              thank you!`;
    if (members.length) {
      const memberIds = members.map((member) => member.id);
      const phones = members.map((member) => member.phone);

      await axios.post(
        "https://api.afromessage.com/api/bulk_send",
        {
          to: [...phones],
          message: message,
          from: process.env.AFRO_IDENTIFIER_ID,
          sender: process.env.AFRO_SENDER_NAME,
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

      Promise.all(
        memberIds.map(async (id) => {
          await updateMembersPaymentStatus({
            memberId: id,
            paymentStatus: false,
          });
        })
      );
    }
  } catch (err) {
    console.error("cron error", err);
  }
};

export async function GET(req: Request) {
  const session = await getServerSession(OPTIONS);
  if (!session?.user?.id) {
    return NextResponse.redirect("/gaadmin/login", 401);
  }

  try {
    initializeCronJob(session.user.id);
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
