import { NextResponse } from "next/server";
import { createPaymentReceipt } from "@/db/paymentReceipt";
import { findMemberByPhone } from "@/db/member";
import { fetchMembershipLevels } from "@/db/membershipLevel";
import { getMinimumContribution } from "@/util/helper";
import { PaymentReceiptType } from "@prisma/client";

// Unauthenticated by design: a signee submitting their *first* registration
// receipt has no session yet (the Member row exists right after they
// finished the signup form — see /api/tempMember/register — but they can't
// log in until it's approved). phone is the identifier throughout, same as
// the Chapa webhook uses.
export async function POST(req: Request) {
  try {
    const { phone, fullName, paymentType, bankName, receiptReferenceNumber } =
      await req.json();

    if (!phone || !fullName) {
      return NextResponse.json(
        { success: false, error: "Missing phone or name" },
        { status: 400 }
      );
    }
    if (
      paymentType !== PaymentReceiptType.Registration &&
      paymentType !== PaymentReceiptType.Contribution
    ) {
      return NextResponse.json(
        { success: false, error: "Invalid payment type" },
        { status: 400 }
      );
    }
    if (!bankName || !String(bankName).trim()) {
      return NextResponse.json(
        { success: false, error: "Bank name is required" },
        { status: 400 }
      );
    }
    if (!receiptReferenceNumber || !String(receiptReferenceNumber).trim()) {
      return NextResponse.json(
        { success: false, error: "Receipt reference number is required" },
        { status: 400 }
      );
    }

    const member = await findMemberByPhone(phone);
    if (!member) {
      return NextResponse.json(
        {
          success: false,
          error:
            "No registration found for this phone number. Please complete the signup form first.",
        },
        { status: 404 }
      );
    }

    // The amount is never taken from the client — it's derived server-side
    // from the member's own membership level/contribution system, the same
    // way the amount shown in the modal is computed, so a member can't
    // submit a receipt claiming to have paid less than their level requires.
    const levels = await fetchMembershipLevels({ activeOnly: true });
    const amount = Math.round(
      getMinimumContribution({
        membershipType: member.membershipType,
        contributionSystem: member.contributionSystem,
        membershipLevel: member.membershipLevel,
        levels,
      })
    );
    if (!amount || amount <= 0) {
      return NextResponse.json(
        {
          success: false,
          error: "Unable to determine the required amount for this membership level",
        },
        { status: 500 }
      );
    }

    const receipt = await createPaymentReceipt({
      phone,
      fullName,
      paymentType,
      bankName: String(bankName).trim(),
      amount,
      receiptReferenceNumber: String(receiptReferenceNumber).trim(),
      memberId: member.id,
    });

    return NextResponse.json(
      { success: true, value: receipt },
      { status: 200 }
    );
  } catch (err) {
    console.warn(err);
    return NextResponse.json(
      { success: false, error: "Unable to submit payment receipt" },
      { status: 500 }
    );
  }
}
