import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { UserRole } from "@prisma/client";
import { OPTIONS } from "@/util/authOptions";
import { findInitiativeById, updateInitiative } from "@/db/initiative";
import { uploadFile, deleteOldFile } from "@/util/uploadFile";

export async function POST(req: Request, context: { params: { id: string } }) {
  const session = await getServerSession(OPTIONS);
  if (!session?.user?.id || session?.user.role === UserRole.Member) {
    return NextResponse.json(
      { success: false, error: "Unauthorized" },
      { status: 401 }
    );
  }

  const initiativeId = context.params.id;

  const formData = await req.formData();
  const featuredImages = formData.getAll("featuredImages") as File[];
  const isDraft = formData.get("isDraft") as string;
  const body = formData.get("body") as string;
  const bodyAmharic = formData.get("bodyAmharic") as string;
  const youtubeLink = formData.get("youtubeLink") as string;
  const nameOfInitiative = formData.get("nameOfInitiative") as string;
  const nameOfInitiativeAmharic = formData.get(
    "nameOfInitiativeAmharic"
  ) as string;

  try {
    const existing = await findInitiativeById(initiativeId);

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

    const removedImages = (existing?.featuredImages ?? []).filter(
      (url) => !imageUrls.includes(url)
    );
    await Promise.all(removedImages.map((url) => deleteOldFile(url)));

    const result = await updateInitiative({
      nameOfInitiative,
      nameOfInitiativeAmharic,
      featuredImages: imageUrls,
      body,
      isDraft: isDraft === "true" ? true : false,
      bodyAmharic,
      id: initiativeId,
      youtubeLink,
    });

    if (result) {
      return NextResponse.json(
        { success: true, value: result },
        { status: 200 }
      );
    }
    return NextResponse.json(
      { success: false, error: "Unable to update initiative" },
      { status: 500 }
    );
  } catch (err) {
    console.warn(err);
    return NextResponse.json(
      {
        success: false,
        error: "Unable to update initiative",
      },
      { status: 500 }
    );
  }
}
