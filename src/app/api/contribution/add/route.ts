import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { UserRole } from "@prisma/client";
import { OPTIONS } from "@/util/authOptions";
import { createContribution } from "@/db/contribution";
import { findMemberById, renewMemberID } from "@/db/member";
import { calculateNextDueDate, getEthiopianYear } from "@/util/date";
import { createAuditLog } from "@/db/auditLog";
import prisma from "@/lib/prisma";

// Staff-only manual payment entry (e.g. cash/office payments) — moves a
// member's nextDueDate and paid-months history, so it's gated and logged
// the same as every other route that touches money.
export async function POST(req: Request) {
  const session = await getServerSession(OPTIONS);
  if (!session?.user?.id || session.user.role === UserRole.Member) {
    return NextResponse.json(
      { success: false, error: "Unauthorized" },
      { status: 401 }
    );
  }

  const { memberId, contributionSystem, contributionAmount } = await req.json();

  try {
    const result = await createContribution({
      contributorId: memberId,
      contributionSystem,
      amount: contributionAmount,
    });
    const member = await findMemberById(memberId);

    if (!member) {
      return NextResponse.json(
        {
          success: false,
          error: "Unable to find member with this Id",
        },
        { status: 500 }
      );
    }
    if (result) {
      const nextDueDate = calculateNextDueDate({
        fromDate: member.nextDueDate,
        contributionSystem: contributionSystem,
      });
      await prisma.member.update({
        where: {
          id: memberId,
        },
        data: { ...member, nextDueDate },
      });
      await renewMemberID({ memberId, ethiopianYear: getEthiopianYear() });

      await createAuditLog({
        entityType: "Member",
        entityId: member.id,
        entityLabel:
          member.institutionName ||
          `${member.firstName ?? ""} ${member.lastName ?? ""}`.trim() ||
          "Unknown",
        action: "UPDATE",
        changes: {
          contribution: {
            from: null,
            to: `${contributionAmount} ETB (${contributionSystem}), manually recorded`,
          },
          nextDueDate: {
            from: member.nextDueDate?.toISOString?.() ?? member.nextDueDate,
            to: nextDueDate?.toISOString?.() ?? nextDueDate,
          },
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
    }
  } catch (err) {
    console.warn(err);
    return NextResponse.json(
      {
        success: false,
        error: "Unable to add contribution",
      },
      { status: 500 }
    );
  }
}
