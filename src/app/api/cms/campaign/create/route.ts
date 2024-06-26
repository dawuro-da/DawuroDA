import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { OPTIONS } from "@/util/authOptions";
import { createCampaign } from "@/db/campaign";

export async function POST(req: Request) {
  const session = await getServerSession(OPTIONS);
  if (!session?.user?.id) {
    return NextResponse.redirect("/gaadmin/login", 401)
  }

  const {
    isDraft,
    startDate,
    endDate,
    campaignLink,
    headline,
    headlineAmharic,
  } = await req.json();
  try {
    const result = await createCampaign({
      campaignLink,
      headline,
      headlineAmharic,
      isDraft,
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
        error: "Unable to create campaign",
      },
      { status: 500 }
    );
  } catch (err) {
    console.warn(err);
    return NextResponse.json(
      {
        success: false,
        error: "Unable to create campaign",
      },
      { status: 500 }
    );
  }
}
