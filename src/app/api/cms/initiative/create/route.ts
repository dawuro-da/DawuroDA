import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { OPTIONS } from "@/app/api/auth/[...nextauth]/route";
import { createInitiative } from "@/db/initiative";

export async function POST(req: Request) {
  const session = await getServerSession(OPTIONS);
  if (!session?.user.id) {
    return NextResponse.json(
      { success: false, error: "Unauthorized user" },
      { status: 401 }
    );
  }

  const {
    nameOfInitiative,
    nameOfInitiativeAmharic,
    featuredImages,
    body,
    bodyAmharic,
  } = await req.json();
  try {
    const result = await createInitiative({
      nameOfInitiative,
      nameOfInitiativeAmharic,
      featuredImages,
      body,
      bodyAmharic,
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
        error: "Unable to create initiative",
      },
      { status: 500 }
    );
  } catch (err) {
    console.warn(err);
    return NextResponse.json(
      {
        success: false,
        error: "Unable to create initiative",
      },
      { status: 500 }
    );
  }
}
