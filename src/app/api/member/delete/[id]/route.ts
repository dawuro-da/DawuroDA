import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { OPTIONS } from "@/util/authOptions";
import { deleteMember, findMemberById } from "@/db/member";

export async function DELETE(
  req: Request,
  context: { params: { id: string } }
) {
  const session = await getServerSession(OPTIONS);
  if (!session?.user?.id) {
    return NextResponse.json(
      { success: false, error: "Unauthorized user" },
      { status: 401 }
    );
  }

  const memberId = context.params.id;

  const member = await findMemberById(memberId);

  if (!member) {
    return NextResponse.json(
      {
        success: false,
        error: "member doesn't exist",
      },
      { status: 400 }
    );
  } else {
    try {
      const result = await deleteMember({ id: memberId });

      if (result) {
        return NextResponse.json(
          { success: true, value: "ok" },
          { status: 200 }
        );
      }
    } catch (err) {
      console.warn(err);
      return NextResponse.json(
        {
          success: false,
          error: "Unable to delete member",
        },
        { status: 500 }
      );
    }
  }
}
