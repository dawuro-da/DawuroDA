import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { OPTIONS } from "@/util/authOptions";
import { createManagement } from "@/db/management";

export async function POST(req: Request) {
  const session = await getServerSession(OPTIONS);
  if (!session?.user?.id) {
    return NextResponse.json(
      { success: false, error: "Unauthorized user" },
      { status: 401 }
    );
  }

  const {
    managerName,
    managerNameAmharic,
    job,
    jobAmharic,
    photo,
    bio,
    bioAmharic,
    isDraft
  } = await req.json();

  try {
    const result = await createManagement({
      managerName,
      isDraft,
      managerNameAmharic,
      job,
      jobAmharic,
      photo,
      bio,
      bioAmharic,
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
        error: "Unable to create management",
      },
      { status: 500 }
    );
  } catch (err) {
    console.warn(err);
    return NextResponse.json(
      {
        success: false,
        error: "Unable to create management",
      },
      { status: 500 }
    );
  }
}
