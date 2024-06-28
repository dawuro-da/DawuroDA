import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { OPTIONS } from "@/util/authOptions";
import { createInitiative } from "@/db/initiative";
import { uploadFile } from "@/util/uploadFile";

export async function POST(req: Request) {
  const session = await getServerSession(OPTIONS);
  if (!session?.user?.id) {
    return NextResponse.redirect("/gaadmin/login", 401)
  }

  const formData = await req.formData();
  const featuredImages = formData.getAll("featuredImages") as File[];
  const isDraft = formData.get("isDraft") as string;
  const body = formData.get("body") as string;
  const bodyAmharic = formData.get("bodyAmharic") as string;
  const nameOfInitiative = formData.get("nameOfInitiative") as string;
  const nameOfInitiativeAmharic = formData.get(
    "nameOfInitiativeAmharic"
  ) as string;

  try {
    let imageUrls = [];
    if (featuredImages.length) {
      for (let k = 0; k < featuredImages.length; k++) {
        if (typeof featuredImages[k] === "string") {
          imageUrls.push(featuredImages[k] as unknown as string);
          continue;
        }
        const url = await uploadFile({
          path: "/initiativeFiles",
          fileName: featuredImages[k].name ?? "name",
          file: featuredImages[k],
          mimeType: featuredImages[k].type,
        });
        if (url) {
          imageUrls.push(url);
        }
      }
    }

    const result = await createInitiative({
      nameOfInitiative,
      isDraft: isDraft === "true" ? true : false,
      nameOfInitiativeAmharic,
      featuredImages: imageUrls,
      body,
      bodyAmharic,
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
        error: "Unable to create initiative",
      },
      { status: 500 }
    );
  } catch (err) {
    console.warn(err);
    return NextResponse.json(
      {
        success: false,
        error: "Unable to create initiative",
      },
      { status: 500 }
    );
  }
}
