import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { OPTIONS } from "@/util/authOptions";
import { deleteManagement, findManagementById } from "@/db/management";

export async function DELETE(
  req: Request,
  context: { params: { id: string } }
) {
  const session = await getServerSession(OPTIONS);
  if (!session?.user?.id) {
    return NextResponse.redirect("/gaadmin/login", 401)
  }

  const managerId = context.params.id;

  const management = await findManagementById(managerId);

  if (!management) {
    return NextResponse.json(
      {
        success: false,
        error: "management doesn't exist",
      },
      { status: 409 }
    );
  } else {
    try {
      const result = await deleteManagement({ id: managerId });

      if (result) {
        return NextResponse.json(
          { success: true, value: "ok" },
          { status: 200 }
        );
      }
      return NextResponse.json(
        {
          success: false,
          error: "Unable to delete management",
        },
        { status: 500 }
      );
    } catch (err) {
      console.warn(err);
      return NextResponse.json(
        {
          success: false,
          error: "Unable to delete management",
        },
        { status: 500 }
      );
    }
  }
}
