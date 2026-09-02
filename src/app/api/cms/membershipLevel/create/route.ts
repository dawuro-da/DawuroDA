import { NextResponse } from "next/server";
import { isStaffSession } from "@/util/session";
import { createMembershipLevel } from "@/db/membershipLevel";

export async function POST(req: Request) {
  if (!(await isStaffSession())) {
    return NextResponse.json(
      { success: false, error: "Unauthorized" },
      { status: 401 }
    );
  }

  try {
    const {
      name,
      nameAmharic,
      sortOrder,
      individualYearlyMin,
      companyYearlyMin,
      idTemplateImage,
    } = await req.json();

    if (!name || typeof name !== "string" || !name.trim()) {
      return NextResponse.json(
        { success: false, error: "A level name is required" },
        { status: 400 }
      );
    }

    const result = await createMembershipLevel({
      name: name.trim(),
      nameAmharic,
      sortOrder: Number(sortOrder) || 0,
      individualYearlyMin: Number(individualYearlyMin) || 0,
      companyYearlyMin: Number(companyYearlyMin) || 0,
      idTemplateImage,
    });

    return NextResponse.json(
      { success: true, value: result },
      { status: 200 }
    );
  } catch (err: any) {
    console.warn(err);
    const isDuplicate = err?.code === "P2002";
    return NextResponse.json(
      {
        success: false,
        error: isDuplicate
          ? "A membership level with this name already exists"
          : "Unable to create membership level",
      },
      { status: isDuplicate ? 409 : 500 }
    );
  }
}
