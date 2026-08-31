import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { UserRole } from "@prisma/client";
import { OPTIONS } from "@/util/authOptions";
import { renewMemberID, findMemberWithContributionsById } from "@/db/member";
import { getEthiopianYear, getRenewalEligibility } from "@/util/date";

// Manual "Renew ID" action for staff — sets the membership ID's renewed
// year to the current Ethiopian year (or backdates to one passed in body).
// Renewal isn't a free action: it requires the member to have actually paid
// for a full year (12 months, via monthly/quarterly/yearly contributions)
// since their last renewal — see getRenewalEligibility.
export async function POST(
  req: Request,
  context: { params: { id: string } }
) {
  const session = await getServerSession(OPTIONS);
  if (!session?.user?.id || session.user.role === UserRole.Member) {
    return NextResponse.json(
      { success: false, error: "Unauthorized" },
      { status: 401 }
    );
  }

  const body = await req.json().catch(() => ({}));
  const ethiopianYear = body?.ethiopianYear ?? getEthiopianYear();

  const member = await findMemberWithContributionsById(context.params.id);
  if (!member) {
    return NextResponse.json(
      { success: false, error: "Member not found" },
      { status: 404 }
    );
  }

  const eligibility = getRenewalEligibility({
    contributions: member.contributions,
    lastRenewedAt: member.idRenewedAt,
    lastRenewedYear: member.idRenewedYear,
    memberSince: member.created_at,
    targetEthiopianYear: ethiopianYear,
  });

  if (!eligibility.eligible) {
    return NextResponse.json(
      { success: false, error: eligibility.reason },
      { status: 400 }
    );
  }

  try {
    const result = await renewMemberID({
      memberId: context.params.id,
      ethiopianYear,
    });

    if (result) {
      return NextResponse.json(
        { success: true, value: result },
        { status: 200 }
      );
    }
    return NextResponse.json(
      { success: false, error: "Unable to renew member ID" },
      { status: 500 }
    );
  } catch (err) {
    console.error(err);
    return NextResponse.json(
      { success: false, error: "Unable to renew member ID" },
      { status: 500 }
    );
  }
}
