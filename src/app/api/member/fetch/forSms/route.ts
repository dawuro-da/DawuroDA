import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { OPTIONS } from "@/util/authOptions";
import { fetchAllMembers, fetchMembers } from "@/db/member";
import { UserRole } from "@prisma/client";

export async function POST(req: Request) {
  const session = await getServerSession(OPTIONS);
  if (!session?.user?.id || session.user.role === UserRole.Member) {
    return NextResponse.redirect("/daadmin/login", 401);
  }

  const { filters, searchText } = await req.json();

  try {
    const result = await fetchAllMembers({ filters, searchText });

    if (result) {
      const updatedData = result.members?.map((member) => ({
        memberId: member.memberId,
        name: member.firstName
          ? `${member.firstName} ${member.lastName}`
          : member.institutionName,
        phone: member.phone,
        hasPaid: member.hasPaid,
      }));
      return NextResponse.json(
        { success: true, value: { members: updatedData, total: result.total } },
        { status: 200 }
      );
    }
  } catch (err) {
    console.warn(err);
    return NextResponse.json(
      {
        success: false,
        error: "Unable to fetch members",
      },
      { status: 500 }
    );
  }
}
