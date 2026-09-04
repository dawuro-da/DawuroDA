import { NextResponse } from "next/server";
import { isStaffSession } from "@/util/session";
import { deleteBankAccount } from "@/db/bankAccount";

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
    await deleteBankAccount(context.params.id);
    return NextResponse.json({ success: true }, { status: 200 });
  } catch (err) {
    console.warn(err);
    return NextResponse.json(
      { success: false, error: "Unable to delete bank account" },
      { status: 500 }
    );
  }
}
