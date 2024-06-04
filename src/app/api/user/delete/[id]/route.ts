import { NextResponse } from "next/server";
import { deleteUser, findUserById } from "@/db/user";
import { getServerSession } from "next-auth";
import { OPTIONS } from "@/app/api/auth/[...nextauth]/route";
import { UserRole } from "@prisma/client";

export async function DELETE(
  req: Request,
  context: { params: { id: string } }
) {
  const session = await getServerSession(OPTIONS);
  if (!session?.user.id || !(session.user.role === UserRole.Owner)) {
    return NextResponse.json(
      { success: false, error: "Unauthorized user" },
      { status: 401 }
    );
  }

  const userId = context.params.id;

  const user = await findUserById(userId);

  if (!user) {
    return NextResponse.json(
      {
        success: false,
        error: "User doesn't exist",
      },
      { status: 409 }
    );
  } else {
    try {
      const result = await deleteUser({ id: userId });

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
          error: "Unable to delete user",
        },
        { status: 500 }
      );
    }
  }
}
