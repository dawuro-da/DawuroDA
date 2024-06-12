import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { createAuction } from "@/db/auction";
import { OPTIONS } from "@/util/authOptions";

export async function POST(req: Request) {
  const session = await getServerSession(OPTIONS);
  if (!session?.user.id) {
    return NextResponse.json(
      { success: false, error: "Unauthorized user" },
      { status: 401 }
    );
  }

  const { CPO, description, title, startDate, endDate } = await req.json();
  try {
    const result = await createAuction({
      CPO,
      description,
      title,
      startDate,
      endDate,
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
        error: "Unable to create event",
      },
      { status: 500 }
    );
  } catch (err) {
    console.warn(err);
    return NextResponse.json(
      {
        success: false,
        error: "Unable to create event",
      },
      { status: 500 }
    );
  }
}
