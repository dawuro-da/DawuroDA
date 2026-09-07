import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { UserRole } from "@prisma/client";
import { OPTIONS } from "@/util/authOptions";
import { findBankAccountById, updateBankAccount } from "@/db/bankAccount";
import { deleteOldFile, uploadFile } from "@/util/uploadFile";
import { createAuditLog, diffFields } from "@/db/auditLog";

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
    const formData = await req.formData();
    const bankName = formData.get("bankName") as string;
    const accountNumber = formData.get("accountNumber") as string;
    const accountHolderName = formData.get("accountHolderName") as string;
    const isActive = formData.get("isActive") as string;
    const sortOrder = formData.get("sortOrder") as string;
    const logo = formData.get("logo") as File;

    const existing = await findBankAccountById(context.params.id);

    let logoUrl: string | undefined;
    if (logo?.name) {
      logoUrl = await uploadFile({
        path: "/bankLogos",
        fileName: logo.name,
        file: logo,
        mimeType: logo.type,
      });
      await deleteOldFile(existing?.logo);
    }

    const result = await updateBankAccount({
      id: context.params.id,
      data: {
        ...(bankName !== undefined && { bankName: bankName.trim() }),
        ...(accountNumber !== undefined && {
          accountNumber: accountNumber.trim(),
        }),
        ...(accountHolderName !== undefined && {
          accountHolderName: accountHolderName?.trim() || undefined,
        }),
        ...(logoUrl !== undefined && { logo: logoUrl }),
        ...(isActive !== undefined && { isActive: isActive === "true" }),
        ...(sortOrder !== undefined && { sortOrder: Number(sortOrder) }),
      },
    });

    if (existing) {
      const changes = diffFields(
        existing,
        {
          bankName: bankName !== undefined ? bankName.trim() : undefined,
          accountNumber:
            accountNumber !== undefined ? accountNumber.trim() : undefined,
          accountHolderName:
            accountHolderName !== undefined
              ? accountHolderName?.trim() || undefined
              : undefined,
          isActive: isActive !== undefined ? isActive === "true" : undefined,
          sortOrder: sortOrder !== undefined ? Number(sortOrder) : undefined,
        },
        [
          "bankName",
          "accountNumber",
          "accountHolderName",
          "isActive",
          "sortOrder",
        ]
      );
      await createAuditLog({
        entityType: "BankAccount",
        entityId: context.params.id,
        entityLabel: `${existing.bankName} — ${existing.accountNumber}`,
        action: "UPDATE",
        changes,
        performedById: session.user.id,
        performedByName:
          `${session.user.firstName ?? ""} ${
            session.user.lastName ?? ""
          }`.trim() || undefined,
        performedByRole: session.user.role,
      });
    }

    return NextResponse.json(
      { success: true, value: result },
      { status: 200 }
    );
  } catch (err) {
    console.warn(err);
    return NextResponse.json(
      { success: false, error: "Unable to update bank account" },
      { status: 500 }
    );
  }
}
