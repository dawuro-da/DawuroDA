import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { OPTIONS } from "@/util/authOptions";
import { deleteCampaign, findCampaignById } from "@/db/campaign";

export async function DELETE(
  req: Request,
  context: { params: { id: string } }
) {
  const session = await getServerSession(OPTIONS);
  if (!session?.user?.id) {
    return NextResponse.redirect("/daadmin/login", 401)
  }

  const campaignId = context.params.id;

  const campaign = await findCampaignById(campaignId);

  if (!campaign) {
    return NextResponse.json(
      {
        success: false,
        error: "campaign doesn't exist",
      },
      { status: 409 }
    );
  } else {
    try {
      const result = await deleteCampaign({ id: campaignId });

      if (result) {
        return NextResponse.json(
          { success: true, value: "ok" },
          { status: 200 }
        );
      }
      return NextResponse.json(
        {
          success: false,
          error: "Unable to delete campaign",
        },
        { status: 500 }
      );
    } catch (err) {
      console.warn(err);
      return NextResponse.json(
        {
          success: false,
          error: "Unable to delete campaign",
        },
        { status: 500 }
      );
    }
  }
}
