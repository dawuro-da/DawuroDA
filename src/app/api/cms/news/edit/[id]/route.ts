import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { UserRole } from "@prisma/client";
import { OPTIONS } from "@/util/authOptions";
import { findNewsById, updateNews } from "@/db/news";
import { uploadFile, deleteOldFile } from "@/util/uploadFile";

export async function POST(req: Request, context: { params: { id: string } }) {
  const session = await getServerSession(OPTIONS);
  if (!session?.user?.id || session?.user.role === UserRole.Member) {
    return NextResponse.json(
      { success: false, error: "Unauthorized" },
      { status: 401 }
    );
  }

  const newsId = context.params.id;
  const formData = await req.formData();

  const profileImages = formData.getAll("profileImage") as File[];
  const isDraft = formData.get("isDraft") as string;
  const body = formData.get("body") as string;
  const youtubeLink = formData.get("youtubeLink") as string;
  const bodyAmharic = formData.get("bodyAmharic") as string;
  const headline = formData.get("headline") as string;
  const headlineAmharic = formData.get("headlineAmharic") as string;
  try {
    const existing = await findNewsById(newsId);

    let imageUrls = [];
    if (profileImages.length) {
      for (let k = 0; k < profileImages.length; k++) {
        if (typeof profileImages[k] === "string") {
          imageUrls.push(profileImages[k] as unknown as string);
          continue;
        }
        const url = await uploadFile({
          path: "/newsImages",
          fileName: profileImages[k].name ?? "newImage",
          file: profileImages[k],
          mimeType: profileImages[k].type,
        });
        if (url) {
          imageUrls.push(url);
        }
      }
    }

    const removedImages = (existing?.profileImage ?? []).filter(
      (url) => !imageUrls.includes(url)
    );
    await Promise.all(removedImages.map((url) => deleteOldFile(url)));
    const result = await updateNews({
      headline,
      headlineAmharic,
      profileImage: imageUrls,
      body,
      isDraft: isDraft === "true" ? true : false,
      bodyAmharic,
      id: newsId,
      youtubeLink,
    });

    if (result) {
      return NextResponse.json(
        { success: true, value: result },
        { status: 200 }
      );
    }
    return NextResponse.json(
      { success: false, error: "Unable to update news" },
      { status: 500 }
    );
  } catch (err) {
    console.warn(err);
    return NextResponse.json(
      {
        success: false,
        error: "Unable to update news",
      },
      { status: 500 }
    );
  }
}
