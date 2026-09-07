import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { UserRole } from "@prisma/client";
import { OPTIONS } from "@/util/authOptions";
import { createMembershipLevel } from "@/db/membershipLevel";
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

    await createAuditLog({
      entityType: "MembershipLevel",
      entityId: result.id,
      entityLabel: result.name,
      action: "CREATE",
      changes: {
        individualYearlyMin: { from: null, to: result.individualYearlyMin },
        companyYearlyMin: { from: null, to: result.companyYearlyMin },
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
