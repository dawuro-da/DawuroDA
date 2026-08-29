import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { UserRole } from "@prisma/client";
import { OPTIONS } from "@/util/authOptions";
import { createDonation } from "@/db/donation";

// Staff-only manual donation entry (e.g. cash/offline gifts) — the single
// other path (besides the Chapa webhook) allowed to move a campaign's
// raisedAmount, so the total always traces back to a real donation record.
export async function POST(req: Request) {
  const session = await getServerSession(OPTIONS);
  if (!session?.user?.id || session.user.role === UserRole.Member) {
    return NextResponse.json(
      { success: false, error: "Unauthorized" },
      { status: 401 }
    );
  }

  const { amount, donationDesignation, fullName, phone, branch, campaignId } =
    await req.json();

  if (!amount || Number(amount) <= 0) {
    return NextResponse.json(
      { success: false, error: "Amount must be greater than zero" },
      { status: 400 }
    );
  }

  try {
    const result = await createDonation({
      amount: `${amount}`,
      donationDesignation: donationDesignation ?? "General Fund",
      fullName: fullName ?? "Unknown",
      phone: phone ?? "",
      branch: branch ?? "Other",
      campaignId,
    });

    if (result) {
      return NextResponse.json(
        { success: true, value: result },
        { status: 200 }
      );
    }
    return NextResponse.json(
      { success: false, error: "Unable to record donation" },
      { status: 500 }
    );
  } catch (err) {
    console.error(err);
    return NextResponse.json(
      { success: false, error: "Unable to record donation" },
      { status: 500 }
    );
  }
}
