import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { UserRole } from "@prisma/client";
import { OPTIONS } from "@/util/authOptions";
import { updateInitiative } from "@/db/initiative";

export async function POST(req: Request, context: { params: { id: string } }) {
  const session = await getServerSession(OPTIONS);
  if (!session?.user?.id || session?.user.role === UserRole.Member) {
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
    isDraft,
  } = await req.json();
  const initiativeId = context.params.id;

  try {
    const result = await updateInitiative({
      nameOfInitiative,
      nameOfInitiativeAmharic,
      featuredImages,
      body,
      isDraft,
      bodyAmharic,
      id: initiativeId,
    });

    if (result) {
      return NextResponse.json(
        { success: true, value: result },
        { status: 200 }
      );
    }
    return NextResponse.json(
      { success: false, error: "Unable to update initiative" },
      { status: 500 }
    );
  } catch (err) {
    console.warn(err);
    return NextResponse.json(
      {
        success: false,
        error: "Unable to update initiative",
      },
      { status: 500 }
    );
  }
}
