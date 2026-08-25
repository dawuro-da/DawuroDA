import { NextResponse } from "next/server";
import { fetchFeaturedCampaign } from "@/db/campaign";

export async function POST() {
  try {
    const campaign = await fetchFeaturedCampaign();

    return NextResponse.json(
      { success: true, value: { campaign } },
      { status: 200 }
    );
  } catch (err) {
    console.warn(err);
    return NextResponse.json(
      {
        success: false,
        error: "Unable to fetch featured campaign",
      },
      { status: 500 }
    );
  }
}
