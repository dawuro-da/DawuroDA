import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { UserRole } from "@prisma/client";
import { OPTIONS } from "@/util/authOptions";
import { updateEvent } from "@/db/event";

export async function POST(req: Request, context: { params: { id: string } }) {
  const session = await getServerSession(OPTIONS);
  if (!session?.user.id || session?.user.role === UserRole.Member) {
    return NextResponse.json(
      { success: false, error: "Unauthorized user" },
      { status: 401 }
    );
  }
  const {
    isDraft,
    headline,
    headlineAmharic,
    profileImage,
    body,
    bodyAmharic,
    startDate,
    endDate,
  } = await req.json();
  const eventId = context.params.id;

  try {
    const result = await updateEvent({
      headline,
      startDate,
      endDate,
      headlineAmharic,
      profileImage,
      body,
      bodyAmharic,
      isDraft,
      id: eventId,
    });

    if (result) {
      return NextResponse.json(
        { success: true, value: result },
        { status: 200 }
      );
    }
    return NextResponse.json(
      { success: false, error: "Unable to update event" },
      { status: 500 }
    );
  } catch (err) {
    console.warn(err);
    return NextResponse.json(
      {
        success: false,
        error: "Unable to update event",
      },
      { status: 500 }
    );
  }
}
