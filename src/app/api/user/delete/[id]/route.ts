import { NextResponse } from "next/server";
import { deleteUser, findUserById } from "@/db/user";
import { getServerSession } from "next-auth";
import { OPTIONS } from "@/util/authOptions";
import { UserRole } from "@prisma/client";
import { createAuditLog } from "@/db/auditLog";

export async function DELETE(
  req: Request,
  context: { params: { id: string } }
) {
  const session = await getServerSession(OPTIONS);
  if (!session?.user?.id || !(session.user.role === UserRole.Owner)) {
    return NextResponse.json(
      { success: false, error: "Unauthorized" },
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
        await createAuditLog({
          entityType: "AdminUser",
          entityId: userId,
          entityLabel:
            `${user.firstName ?? ""} ${user.lastName ?? ""}`.trim() ||
            user.email,
          action: "DELETE",
          changes: { role: { from: user.role, to: null } },
          performedById: session.user.id,
          performedByName:
            `${session.user.firstName ?? ""} ${
              session.user.lastName ?? ""
            }`.trim() || undefined,
          performedByRole: session.user.role,
        });
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
