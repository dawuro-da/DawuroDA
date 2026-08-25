import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { OPTIONS } from "@/util/authOptions";
import { deletePartnership, findPartnershipById } from "@/db/partnership";

export async function DELETE(
  req: Request,
  context: { params: { id: string } }
) {
  const session = await getServerSession(OPTIONS);
  if (!session?.user?.id) {
    return NextResponse.redirect("/daadmin/login", 401)
  }

  const partnershipId = context.params.id;

  const partnership = await findPartnershipById(partnershipId);

  if (!partnership) {
    return NextResponse.json(
      {
        success: false,
        error: "partnership doesn't exist",
      },
      { status: 409 }
    );
  } else {
    try {
      const result = await deletePartnership({ id: partnershipId });

      if (result) {
        return NextResponse.json(
          { success: true, value: "ok" },
          { status: 200 }
        );
      }
      return NextResponse.json(
        {
          success: false,
          error: "Unable to delete partnership",
        },
        { status: 500 }
      );
    } catch (err) {
      console.warn(err);
      return NextResponse.json(
        {
          success: false,
          error: "Unable to delete partnership",
        },
        { status: 500 }
      );
    }
  }
}
