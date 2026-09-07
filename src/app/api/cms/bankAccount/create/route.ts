import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { UserRole } from "@prisma/client";
import { OPTIONS } from "@/util/authOptions";
import { createBankAccount } from "@/db/bankAccount";
import { uploadFile } from "@/util/uploadFile";
import { createAuditLog } from "@/db/auditLog";

export async function POST(req: Request) {
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
    const formData = await req.formData();
    const bankName = formData.get("bankName") as string;
    const accountNumber = formData.get("accountNumber") as string;
    const accountHolderName = formData.get("accountHolderName") as string;
    const sortOrder = formData.get("sortOrder") as string;
    const logo = formData.get("logo") as File;

    if (!bankName || !bankName.trim()) {
      return NextResponse.json(
        { success: false, error: "A bank name is required" },
        { status: 400 }
      );
    }
    if (!accountNumber || !accountNumber.trim()) {
      return NextResponse.json(
        { success: false, error: "An account number is required" },
        { status: 400 }
      );
    }

    const logoUrl = logo?.name
      ? await uploadFile({
          path: "/bankLogos",
          fileName: logo.name,
          file: logo,
          mimeType: logo.type,
        })
      : undefined;

    const result = await createBankAccount({
      bankName: bankName.trim(),
      accountNumber: accountNumber.trim(),
      accountHolderName: accountHolderName?.trim() || undefined,
      logo: logoUrl,
      sortOrder: Number(sortOrder) || 0,
    });

    await createAuditLog({
      entityType: "BankAccount",
      entityId: result.id,
      entityLabel: `${result.bankName} — ${result.accountNumber}`,
      action: "CREATE",
      changes: {
        bankName: { from: null, to: result.bankName },
        accountNumber: { from: null, to: result.accountNumber },
      },
      performedById: session.user.id,
      performedByName:
        `${session.user.firstName ?? ""} ${
          session.user.lastName ?? ""
        }`.trim() || undefined,
      performedByRole: session.user.role,
    });

    return NextResponse.json(
      { success: true, value: result },
      { status: 200 }
    );
  } catch (err) {
    console.warn(err);
    return NextResponse.json(
      { success: false, error: "Unable to create bank account" },
      { status: 500 }
    );
  }
}
