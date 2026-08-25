import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { OPTIONS } from "@/util/authOptions";
import { createNews } from "@/db/news";
import { uploadFile } from "@/util/uploadFile";

export async function POST(req: Request) {
  const session = await getServerSession(OPTIONS);
  if (!session?.user?.id) {
    return NextResponse.redirect("/daadmin/login", 401);
  }

  const formData = await req.formData();
  const profileImages = formData.getAll("profileImage") as File[];
  const isDraft = formData.get("isDraft") as string;
  const body = formData.get("body") as string;
  const youtubeLink = formData.get("youtubeLink") as string;
  const bodyAmharic = formData.get("bodyAmharic") as string;
  const headline = formData.get("headline") as string;
  const headlineAmharic = formData.get("headlineAmharic") as string;

  try {
    let imageUrls = [];
    if (profileImages.length) {
      for (let k = 0; k < profileImages.length; k++) {
        if (typeof profileImages[k] === "string") {
          imageUrls.push(profileImages[k] as unknown as string);
          continue;
        }
        const url = await uploadFile({
          path: "/newsImages",
          fileName: profileImages[k].name ?? "name",
          file: profileImages[k],
          mimeType: profileImages[k].type,
        });
        if (url) {
          imageUrls.push(url);
        }
      }
    }

    const result = await createNews({
      profileImage: imageUrls,
      body,
      bodyAmharic,
      headline,
      isDraft: isDraft === "true" ? true : false,
      headlineAmharic,
      youtubeLink,
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
        error: "Unable to create news",
      },
      { status: 500 }
    );
  } catch (err) {
    console.warn(err);
    return NextResponse.json(
      {
        success: false,
        error: "Unable to create news",
      },
      { status: 500 }
    );
  }
}
