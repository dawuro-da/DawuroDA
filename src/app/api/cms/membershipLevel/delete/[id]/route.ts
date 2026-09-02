import { NextResponse } from "next/server";
import { isStaffSession } from "@/util/session";
import { deleteMembershipLevel } from "@/db/membershipLevel";

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
    return NextResponse.json({ success: true }, { status: 200 });
  } catch (err) {
    console.warn(err);
    return NextResponse.json(
      { success: false, error: "Unable to delete membership level" },
      { status: 500 }
    );
  }
}
