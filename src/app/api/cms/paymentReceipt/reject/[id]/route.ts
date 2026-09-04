import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { OPTIONS } from "@/util/authOptions";
import { UserRole } from "@prisma/client";
import {
  findPaymentReceiptById,
  markPaymentReceiptRejected,
} from "@/db/paymentReceipt";
import { createAuditLog } from "@/db/auditLog";

export async function POST(
  req: Request,
  context: { params: { id: string } }
) {
  const session = await getServerSession(OPTIONS);
  const isStaff = Boolean(
    session?.user?.role && session.user.role !== UserRole.Member
  );
  if (!isStaff || !session?.user) {
    return NextResponse.json(
      { success: false, error: "Unauthorized" },
      { status: 401 }
    );
  }

  try {
    const receipt = await findPaymentReceiptById(context.params.id);
    if (!receipt) {
      return NextResponse.json(
        { success: false, error: "Receipt not found" },
        { status: 404 }
      );
    }
    if (receipt.status !== "Pending") {
      return NextResponse.json(
        { success: false, error: "This receipt has already been reviewed" },
        { status: 409 }
      );
    }

    const { rejectionReason } = await req.json().catch(() => ({}));
    const performedByName =
      `${session.user.firstName ?? ""} ${session.user.lastName ?? ""}`.trim() ||
      undefined;

    const updated = await markPaymentReceiptRejected({
      id: context.params.id,
      rejectionReason,
      reviewedById: session.user.id,
      reviewedByName: performedByName ?? "Unknown",
    });

    await createAuditLog({
      entityType: "PaymentReceipt",
      entityId: receipt.id,
      entityLabel: `${receipt.fullName} — ${receipt.phone}`,
      action: "UPDATE",
      changes: {
        status: { from: "Pending", to: "Rejected" },
        ...(rejectionReason && {
          rejectionReason: { from: null, to: rejectionReason },
        }),
      },
      performedById: session.user.id,
      performedByName,
      performedByRole: session.user.role,
    });

    return NextResponse.json(
      { success: true, value: updated },
      { status: 200 }
    );
  } catch (err) {
    console.warn(err);
    return NextResponse.json(
      { success: false, error: "Unable to reject payment receipt" },
      { status: 500 }
    );
  }
}
