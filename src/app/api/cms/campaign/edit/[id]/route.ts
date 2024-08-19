import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { UserRole } from "@prisma/client";
import { OPTIONS } from "@/util/authOptions";
import { updateCampaign } from "@/db/campaign";

export async function POST(req: Request, context: { params: { id: string } }) {
  const session = await getServerSession(OPTIONS);
  if (!session?.user?.id || session?.user.role === UserRole.Member) {
    return NextResponse.redirect("/gaadmin/login", 401)
  }
  const {
    isDraft,
    headline,
    headlineAmharic,
    description,
    startDate,
    endDate,
  } = await req.json();
  const campaignId = context.params.id;

  try {
    const result = await updateCampaign({
      headline,
      startDate,
      endDate,
      headlineAmharic,
      description,
      isDraft,
      id: campaignId,
    });

    if (result) {
      return NextResponse.json(
        { success: true, value: result },
        { status: 200 }
      );
    }
    return NextResponse.json(
      { success: false, error: "Unable to update campaign" },
      { status: 500 }
    );
  } catch (err) {
    console.warn(err);
    return NextResponse.json(
      {
        success: false,
        error: "Unable to update campaign",
      },
      { status: 500 }
    );
  }
}
