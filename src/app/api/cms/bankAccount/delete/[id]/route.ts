import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { UserRole } from "@prisma/client";
import { OPTIONS } from "@/util/authOptions";
import { findBankAccountById, deleteBankAccount } from "@/db/bankAccount";
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
    const existing = await findBankAccountById(context.params.id);
    await deleteBankAccount(context.params.id);

    if (existing) {
      await createAuditLog({
        entityType: "BankAccount",
        entityId: context.params.id,
        entityLabel: `${existing.bankName} — ${existing.accountNumber}`,
        action: "DELETE",
        performedById: session.user.id,
        performedByName:
          `${session.user.firstName ?? ""} ${
            session.user.lastName ?? ""
          }`.trim() || undefined,
        performedByRole: session.user.role,
      });
    }

    return NextResponse.json({ success: true }, { status: 200 });
  } catch (err) {
    console.warn(err);
    return NextResponse.json(
      { success: false, error: "Unable to delete bank account" },
      { status: 500 }
    );
  }
}
