import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { UserRole } from "@prisma/client";
import { OPTIONS } from "@/util/authOptions";
import { updatePartnership } from "@/db/partnership";

export async function POST(req: Request, context: { params: { id: string } }) {
  const session = await getServerSession(OPTIONS);
  if (!session?.user.id || session?.user.role === UserRole.Member) {
    return NextResponse.json(
      { success: false, error: "Unauthorized user" },
      { status: 401 }
    );
  }
  const { partnerName, partnerNameAmharic, logo, bio, bioAmharic } =
    await req.json();
  const partnershipId = context.params.id;

  try {
    const result = await updatePartnership({
      partnerName,
      partnerNameAmharic,
      logo,
      bio,
      bioAmharic,
      id: partnershipId,
    });

    if (result) {
      return NextResponse.json(
        { success: true, value: result },
        { status: 200 }
      );
    }
    return NextResponse.json(
      { success: false, error: "Unable to update partnership" },
      { status: 500 }
    );
  } catch (err) {
    console.warn(err);
    return NextResponse.json(
      {
        success: false,
        error: "Unable to update partnership",
      },
      { status: 500 }
    );
  }
}
