import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { UserRole } from "@prisma/client";
import { OPTIONS } from "@/util/authOptions";
import { findEventById, updateEvent } from "@/db/event";
import { uploadFile, deleteOldFile } from "@/util/uploadFile";

export async function POST(req: Request, context: { params: { id: string } }) {
  const session = await getServerSession(OPTIONS);
  if (!session?.user?.id || session?.user.role === UserRole.Member) {
    return NextResponse.redirect("/daadmin/login", 401);
  }

  const eventId = context.params.id;
  const formData = await req.formData();
  const isDraft = formData.get("isDraft") as string;
  const startDate = formData.get("startDate") as string;
  const endDate = formData.get("endDate") as string;
  const profileImage = formData.get("profileImage") as File | string | null;
  const body = formData.get("body") as string;
  const bodyAmharic = formData.get("bodyAmharic") as string;
  const headline = formData.get("headline") as string;
  const headlineAmharic = formData.get("headlineAmharic") as string;

  try {
    const existing = await findEventById(eventId);

    let imageUrl: string | undefined;
    if (profileImage && typeof profileImage !== "string" && profileImage.name) {
      imageUrl = await uploadFile({
        path: "/eventImages",
        fileName: profileImage.name,
        file: profileImage,
        mimeType: profileImage.type,
      });
      await deleteOldFile(existing?.profileImage);
    } else if (typeof profileImage === "string" && profileImage) {
      imageUrl = profileImage;
    }

    const result = await updateEvent({
      headline,
      startDate,
      endDate,
      headlineAmharic,
      profileImage: imageUrl ?? existing?.profileImage ?? "",
      body,
      bodyAmharic,
      isDraft: isDraft === "true" ? true : false,
      id: eventId,
    });

    if (result) {
      return NextResponse.json(
        { success: true, value: result },
        { status: 200 }
      );
    }
    return NextResponse.json(
      { success: false, error: "Unable to update event" },
      { status: 500 }
    );
  } catch (err) {
    console.warn(err);
    return NextResponse.json(
      {
        success: false,
        error: "Unable to update event",
      },
      { status: 500 }
    );
  }
}
