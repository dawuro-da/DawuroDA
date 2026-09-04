import { NextResponse } from "next/server";
import { createPaymentReceipt } from "@/db/paymentReceipt";
import { findMemberByPhone } from "@/db/member";
import { PaymentReceiptType } from "@prisma/client";

// Intentionally unauthenticated — a brand-new signee submitting a
// registration receipt isn't a Member yet (no session exists for them at
// that point, same reason Chapa's registrationPayment route has no auth
// check either). phone is the identifier throughout, same as the Chapa
// webhook uses.
export async function POST(req: Request) {
  try {
    const { phone, fullName, paymentType, bankName, amount, receiptReferenceNumber } =
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
    const amountNumber = Number(amount);
    if (!amountNumber || amountNumber <= 0) {
      return NextResponse.json(
        { success: false, error: "A valid amount is required" },
        { status: 400 }
      );
    }

    // For a contribution receipt the member already exists — link it now so
    // the admin queue can show/act on it without a phone lookup later. A
    // registration receipt has no Member yet (still a TempMember), so this
    // stays unset until the receipt is approved.
    const member =
      paymentType === PaymentReceiptType.Contribution
        ? await findMemberByPhone(phone)
        : null;

    const receipt = await createPaymentReceipt({
      phone,
      fullName,
      paymentType,
      bankName: String(bankName).trim(),
      amount: Math.round(amountNumber),
      receiptReferenceNumber: String(receiptReferenceNumber).trim(),
      memberId: member?.id,
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
