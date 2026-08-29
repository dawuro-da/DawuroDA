import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { UserRole } from "@prisma/client";
import { OPTIONS } from "@/util/authOptions";
import { renewMemberID } from "@/db/member";
import { getEthiopianYear } from "@/util/date";

// Manual "Renew ID" action for staff — sets the membership ID's renewed
// year to the current Ethiopian year (or backdates to one passed in body).
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
