import { NextResponse } from "next/server";
import { isStaffSession } from "@/util/session";
import { fetchPaymentReceipts } from "@/db/paymentReceipt";
import { PaymentReceiptStatus } from "@prisma/client";

export async function POST(req: Request) {
  if (!(await isStaffSession())) {
    return NextResponse.json(
      { success: false, error: "Unauthorized" },
      { status: 401 }
    );
  }

  const { page, pageSize, status } = await req.json().catch(() => ({}));

  try {
    const result = await fetchPaymentReceipts({
      page: Number(page) || 1,
      pageSize: Number(pageSize) || 20,
      status:
        status && Object.values(PaymentReceiptStatus).includes(status)
          ? status
          : undefined,
    });
    return NextResponse.json({ success: true, value: result }, { status: 200 });
  } catch (err) {
    console.warn(err);
    return NextResponse.json(
      { success: false, error: "Unable to fetch payment receipts" },
      { status: 500 }
    );
  }
}
