import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { OPTIONS } from "@/util/authOptions";
import { createContribution } from "@/db/contribution";
import { findMemberById } from "@/db/member";
import { calculateNextDueDate } from "@/util/date";
import prisma from "@/lib/prisma";

export async function POST(req: Request) {
  const session = await getServerSession(OPTIONS);
  if (!session?.user?.id) {
    return NextResponse.redirect("/gaadmin/login", 401)
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
      const res = await prisma.member.update({
        where: {
          id: memberId,
        },
        data: { ...member, nextDueDate },
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
