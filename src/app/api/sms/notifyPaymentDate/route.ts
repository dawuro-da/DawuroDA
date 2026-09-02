import { NextResponse } from "next/server";
import { creatSmsMessage } from "@/db/sms";
import axios from "axios";
import {
  fetchMembersWithUpcomingPayments,
  updateMembersPaymentStatus,
} from "@/db/member";

const initializeCronJob = async () => {
  try {
    const members = await fetchMembersWithUpcomingPayments();
    const message = `Hello,
              your payment is due. Please pay soon to avoid service disruption.
              Thank you!`;

    if (members.length === 1) {
      // Afromessage's bulk_send endpoint rejects anything under 2
      // recipients, so a lone member due for payment can't go through this
      // path at all — log it clearly rather than let it fail silently
      // every time the cron runs.
      console.warn(
        `notifyPaymentDate: skipped — only 1 member (${members[0].id}) is due, but Afromessage requires at least 2 recipients per batch`
      );
    } else if (members.length) {
      const memberIds = members.map((member) => member.id);
      const phones = members.map((member) => member.phone);

      const response = await axios.post(
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

      // Afromessage responds with HTTP 200 even when it rejects the
      // request — bail out before recording the message as sent and
      // marking members as notified if it was actually rejected.
      if (response.data?.acknowledge !== "success") {
        console.error("Afromessage bulk_send rejected:", response.data);
        return;
      }

      await creatSmsMessage({
        message: message,
        totalPhones: phones.length,
      });

      await Promise.all(
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
  // Check for a secure token in the request headers or query parameters
  const url = new URL(req.url);
  const token = url.searchParams.get("cronToken");
  
  if (token !== process.env.CRON_JOB_TOKEN) {
    return NextResponse.json(
      { success: false, error: "Unauthorized" },
      { status: 401 }
    );
  }

  try {
    await initializeCronJob();
    return NextResponse.json({ success: true, value: "OK" }, { status: 200 });
  } catch (err) {
    console.error(err);
    return NextResponse.json(
      { success: false, error: "Internal Server Error" },
      { status: 500 }
    );
  }
}
