import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { OPTIONS } from "@/util/authOptions";
import { deleteEvent, findEventById } from "@/db/event";

export async function DELETE(
  req: Request,
  context: { params: { id: string } }
) {
  const session = await getServerSession(OPTIONS);
  if (!session?.user.id) {
    return NextResponse.json(
      { success: false, error: "Unauthorized user" },
      { status: 401 }
    );
  }

  const eventId = context.params.id;

  const event = await findEventById(eventId);

  if (!event) {
    return NextResponse.json(
      {
        success: false,
        error: "event doesn't exist",
      },
      { status: 409 }
    );
  } else {
    try {
      const result = await deleteEvent({ id: eventId });

      if (result) {
        return NextResponse.json(
          { success: true, value: "ok" },
          { status: 200 }
        );
      }
      return NextResponse.json(
        {
          success: false,
          error: "Unable to delete event",
        },
        { status: 500 }
      );
    } catch (err) {
      console.warn(err);
      return NextResponse.json(
        {
          success: false,
          error: "Unable to delete event",
        },
        { status: 500 }
      );
    }
  }
}
