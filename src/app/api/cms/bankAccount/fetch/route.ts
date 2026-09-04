import { NextResponse } from "next/server";
import { fetchBankAccounts } from "@/db/bankAccount";
import { isStaffSession } from "@/util/session";

// Public — members need this list to render the "pay by bank transfer"
// screen. Only staff see inactive (deactivated) accounts; everyone else
// only sees the active ones.
export async function POST() {
  try {
    const isStaff = await isStaffSession();
    const accounts = await fetchBankAccounts({ activeOnly: !isStaff });

    return NextResponse.json(
      { success: true, value: accounts },
      { status: 200 }
    );
  } catch (err) {
    console.warn(err);
    return NextResponse.json(
      { success: false, error: "Unable to fetch bank accounts" },
      { status: 500 }
    );
  }
}
