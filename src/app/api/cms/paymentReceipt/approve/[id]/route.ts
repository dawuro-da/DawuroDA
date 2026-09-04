import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { OPTIONS } from "@/util/authOptions";
import { UserRole } from "@prisma/client";
import {
  findPaymentReceiptById,
  markPaymentReceiptApproved,
} from "@/db/paymentReceipt";
import { findTempMemberByPhone } from "@/db/tempMember";
import { findMemberById, findMemberByPhone } from "@/db/member";
import { applyContributionPayment, applyRegistrationPayment } from "@/db/payment";
import { createAuditLog } from "@/db/auditLog";

// Approving a receipt runs the exact same payment-effects code the Chapa
// webhook runs (src/db/payment.ts) — a manual bank transfer and an online
// Chapa payment can never apply their effects differently.
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

    let member;
    if (receipt.paymentType === "Registration") {
      const tempMember = await findTempMemberByPhone(receipt.phone);
      if (!tempMember) {
        return NextResponse.json(
          {
            success: false,
            error:
              "No pending registration found for this phone number — it may have already been completed or the signup was never finished",
          },
          { status: 404 }
        );
      }
      member = await applyRegistrationPayment(tempMember);
    } else {
      member = receipt.memberId
        ? await findMemberById(receipt.memberId)
        : await findMemberByPhone(receipt.phone);
      if (!member) {
        return NextResponse.json(
          { success: false, error: "Member not found for this phone number" },
          { status: 404 }
        );
      }
      await applyContributionPayment(member, receipt.amount);
    }

    if (!member) {
      return NextResponse.json(
        { success: false, error: "Unable to apply payment" },
        { status: 500 }
      );
    }

    const performedByName =
      `${session.user.firstName ?? ""} ${session.user.lastName ?? ""}`.trim() ||
      undefined;

    const updated = await markPaymentReceiptApproved({
      id: context.params.id,
      memberId: member.id,
      reviewedById: session.user.id,
      reviewedByName: performedByName ?? "Unknown",
    });

    await createAuditLog({
      entityType: "Member",
      entityId: member.id,
      entityLabel:
        member.institutionName ||
        `${member.firstName ?? ""} ${member.lastName ?? ""}`.trim() ||
        "Unknown",
      action: receipt.paymentType === "Registration" ? "CREATE" : "UPDATE",
      changes: {
        paymentReceipt: {
          from: null,
          to: `${receipt.paymentType} — ${receipt.bankName}, ref ${receipt.receiptReferenceNumber}, ${receipt.amount} ETB`,
        },
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
      { success: false, error: "Unable to approve payment receipt" },
      { status: 500 }
    );
  }
}
