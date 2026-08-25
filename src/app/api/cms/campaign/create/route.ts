import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { OPTIONS } from "@/util/authOptions";
import { createCampaign } from "@/db/campaign";
import { uploadFile } from "@/util/uploadFile";

export async function POST(req: Request) {
  const session = await getServerSession(OPTIONS);
  if (!session?.user?.id) {
    return NextResponse.redirect("/gaadmin/login", 401);
  }

  const formData = await req.formData();
  const isDraft = formData.get("isDraft") as string;
  const isFeatured = formData.get("isFeatured") as string;
  const startDate = formData.get("startDate") as string;
  const endDate = formData.get("endDate") as string;
  const description = formData.get("description") as string;
  const headline = formData.get("headline") as string;
  const headlineAmharic = formData.get("headlineAmharic") as string;
  const youtubeLink = formData.get("youtubeLink") as string;
  const goalAmount = formData.get("goalAmount") as string;
  const raisedAmount = formData.get("raisedAmount") as string;
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
      headline,
      headlineAmharic,
      image: imageUrl,
      youtubeLink: youtubeLink || undefined,
      goalAmount: goalAmount ? Number(goalAmount) : undefined,
      raisedAmount: raisedAmount ? Number(raisedAmount) : undefined,
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
