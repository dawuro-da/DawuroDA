import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { OPTIONS } from "@/util/authOptions";
import { findProfileById } from "@/db/member";

export async function GET(req: Request, context: { params: { id: string } }) {
  const session = await getServerSession(OPTIONS);
  if (!session?.user?.id) {
    return NextResponse.json(
      {
        success: false,
        error: "Unauthorized member",
      },
      { status: 401 }
    );
  }

  try {
    const memberId = context.params.id;
    const result = await findProfileById(memberId);

    if (result) {
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
        error: "Unable to fetch members",
      },
      { status: 500 }
    );
  }
}
