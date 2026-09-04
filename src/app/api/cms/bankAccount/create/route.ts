import { NextResponse } from "next/server";
import { isStaffSession } from "@/util/session";
import { createBankAccount } from "@/db/bankAccount";
import { uploadFile } from "@/util/uploadFile";

export async function POST(req: Request) {
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
