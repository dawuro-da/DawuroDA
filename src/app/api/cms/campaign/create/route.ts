import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { OPTIONS } from "@/util/authOptions";
import { createCampaign } from "@/db/campaign";
import { uploadFile } from "@/util/uploadFile";

export async function POST(req: Request) {
  const session = await getServerSession(OPTIONS);
  if (!session?.user?.id) {
    return NextResponse.redirect("/daadmin/login", 401);
  }

  const formData = await req.formData();
  const isDraft = formData.get("isDraft") as string;
  const isFeatured = formData.get("isFeatured") as string;
  const startDate = formData.get("startDate") as string;
  const endDate = formData.get("endDate") as string;
  const description = formData.get("description") as string;
  const descriptionAmharic = formData.get("descriptionAmharic") as string;
  const headline = formData.get("headline") as string;
  const headlineAmharic = formData.get("headlineAmharic") as string;
  const youtubeLink = formData.get("youtubeLink") as string;
  const goalAmount = formData.get("goalAmount") as string;
  const photo = formData.get("image") as File | string | null;

  try {
    let imageUrl: string | undefined;
    if (photo && typeof photo !== "string" && photo.name) {
      imageUrl =
        (await uploadFile({
          path: "/campaignImages",
          fileName: photo.name,
          file: photo,
          mimeType: photo.type,
        })) ?? undefined;
    } else if (typeof photo === "string" && photo) {
      imageUrl = photo;
    }

    const result = await createCampaign({
      description,
      descriptionAmharic: descriptionAmharic || "",
      headline,
      headlineAmharic,
      image: imageUrl,
      youtubeLink: youtubeLink || undefined,
      goalAmount: goalAmount ? Number(goalAmount) : undefined,
      // raisedAmount is never accepted from the client — it always starts
      // at the schema default (0) and only ever moves via real donation
      // records (see /api/cms/donation/create and the Chapa webhook).
      raisedAmount: 0,
      isFeatured: isFeatured === "true",
      isDraft: isDraft === "true",
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
