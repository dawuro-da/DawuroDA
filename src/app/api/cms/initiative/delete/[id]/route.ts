import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { OPTIONS } from "@/util/authOptions";
import { findInitiativeById, deleteInitiative } from "@/db/initiative";

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

  const initiativeId = context.params.id;

  const initiative = await findInitiativeById(initiativeId);

  if (!initiative) {
    return NextResponse.json(
      {
        success: false,
        error: "initiative doesn't exist",
      },
      { status: 409 }
    );
  } else {
    try {
      const result = await deleteInitiative({ id: initiativeId });

      if (result) {
        return NextResponse.json(
          { success: true, value: "ok" },
          { status: 200 }
        );
      }
      return NextResponse.json(
        {
          success: false,
          error: "Unable to delete initiative",
        },
        { status: 500 }
      );
    } catch (err) {
      console.warn(err);
      return NextResponse.json(
        {
          success: false,
          error: "Unable to delete initiative",
        },
        { status: 500 }
      );
    }
  }
}
