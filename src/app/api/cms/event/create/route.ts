import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { OPTIONS } from "@/util/authOptions";
import { createEvent } from "@/db/event";
import { uploadFile } from "@/util/uploadFile";

export async function POST(req: Request) {
  const session = await getServerSession(OPTIONS);
  if (!session?.user?.id) {
    return NextResponse.redirect("/daadmin/login", 401);
  }

  const formData = await req.formData();
  const isDraft = formData.get("isDraft") as string;
  const startDate = formData.get("startDate") as string;
  const endDate = formData.get("endDate") as string;
  const profileImage = formData.get("profileImage") as File;
  const body = formData.get("body") as string;
  const bodyAmharic = formData.get("bodyAmharic") as string;
  const headline = formData.get("headline") as string;
  const headlineAmharic = formData.get("headlineAmharic") as string;

  try {
    const imageUrl = profileImage?.name
      ? await uploadFile({
          path: "/eventImages",
          fileName: profileImage.name ?? "name",
          file: profileImage,
          mimeType: profileImage.type,
        })
      : (profileImage as unknown as string);

    const result = await createEvent({
      profileImage: imageUrl,
      body,
      bodyAmharic,
      headline,
      headlineAmharic,
      isDraft: isDraft === "true" ? true : false,
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
        error: "Unable to create event",
      },
      { status: 500 }
    );
  } catch (err) {
    console.warn(err);
    return NextResponse.json(
      {
        success: false,
        error: "Unable to create event",
      },
      { status: 500 }
    );
  }
}
