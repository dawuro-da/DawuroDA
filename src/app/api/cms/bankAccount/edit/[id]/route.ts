import { NextResponse } from "next/server";
import { isStaffSession } from "@/util/session";
import { findBankAccountById, updateBankAccount } from "@/db/bankAccount";
import { deleteOldFile, uploadFile } from "@/util/uploadFile";

export async function POST(
  req: Request,
  context: { params: { id: string } }
) {
  if (!(await isStaffSession())) {
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

    let logoUrl: string | undefined;
    if (logo?.name) {
      const existing = await findBankAccountById(context.params.id);
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
