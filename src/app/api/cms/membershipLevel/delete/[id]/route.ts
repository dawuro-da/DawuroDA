import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { UserRole } from "@prisma/client";
import { OPTIONS } from "@/util/authOptions";
import {
  deleteMembershipLevel,
  findMembershipLevelById,
} from "@/db/membershipLevel";
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
    const existing = await findMembershipLevelById(context.params.id);
    const result = await deleteMembershipLevel(context.params.id);
    if (!result.deleted) {
      return NextResponse.json(
        {
          success: false,
          error: result.membersUsingIt
            ? `${result.membersUsingIt} member(s) currently use this level — deactivate it instead of deleting`
            : "Membership level not found",
        },
        { status: 409 }
      );
    }

    if (existing) {
      await createAuditLog({
        entityType: "MembershipLevel",
        entityId: context.params.id,
        entityLabel: existing.name,
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
      { success: false, error: "Unable to delete membership level" },
      { status: 500 }
    );
  }
}
