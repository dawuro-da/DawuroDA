import { NextResponse } from "next/server";
import { approveUser } from "@/db/user";
import { getServerSession } from "next-auth";
import { OPTIONS } from "@/app/api/auth/[...nextauth]/route";

export async function GET(
  req: Request,
  { params }: { params: { id: string } }
) {
  const session = await getServerSession(OPTIONS);
  if (!session?.user.id) {
    return NextResponse.json(
      { success: false, error: "Unauthorized user" },
      { status: 401 }
    );
  }

  const userId = params.id;

  try {
    const result = await approveUser({
      userId,
      isApproved: true,
      approvedBy: session.user.id,
    });

    if (result) {
      return NextResponse.json(
        { success: true, value: result },
        { status: 200 }
      );
    }
    return NextResponse.json(
      {
        success: false,
        error: "Unable to update user",
      },
      { status: 500 }
    );
  } catch (err) {
    console.warn(err);
    return NextResponse.json(
      {
        success: false,
        error: "Unable to update user",
      },
      { status: 500 }
    );
  }
}
