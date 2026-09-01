import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { UserRole } from "@prisma/client";
import { OPTIONS } from "@/util/authOptions";
import { fetchAboutContentBySection, upsertAboutContent } from "@/db/aboutContent";
import { uploadFile, deleteOldFile } from "@/util/uploadFile";

export async function POST(
  req: Request,
  context: { params: { section: string } }
) {
  const session = await getServerSession(OPTIONS);
  if (!session?.user?.id || session?.user.role === UserRole.Member) {
    return NextResponse.json(
      { success: false, error: "Unauthorized" },
      { status: 401 }
    );
  }
  const section = context.params.section;

  try {
    const formData = await req.formData();
    const title = formData.get("title") as string;
    const titleAmharic = formData.get("titleAmharic") as string;
    const subtitle = formData.get("subtitle") as string;
    const subtitleAmharic = formData.get("subtitleAmharic") as string;
    const body = formData.get("body") as string;
    const bodyAmharic = formData.get("bodyAmharic") as string;
    const itemsText = formData.get("items") as string | null;
    const itemsAmharicText = formData.get("itemsAmharic") as string | null;
    const isDraft = formData.get("isDraft") as string;
    const image = formData.get("image") as File | string | null;

    const toItems = (value: string | null) =>
      value
        ?.split("\n")
        .map((item) => item.trim())
        .filter(Boolean);

    let imageUrl: string | undefined;
    if (image && typeof image !== "string" && image.name) {
      const existing = await fetchAboutContentBySection({
        section,
        includeDrafts: true,
      });
      imageUrl = await uploadFile({
        path: "/aboutContent",
        fileName: image.name ?? "name",
        file: image,
        mimeType: image.type,
      });
      await deleteOldFile(existing?.image);
    } else {
      imageUrl = image as string | undefined;
    }

    const result = await upsertAboutContent({
      section,
      title: title ?? "",
      titleAmharic: titleAmharic ?? "",
      subtitle: subtitle ?? "",
      subtitleAmharic: subtitleAmharic ?? "",
      body: body ?? "",
      bodyAmharic: bodyAmharic ?? "",
      items: toItems(itemsText),
      itemsAmharic: toItems(itemsAmharicText),
      image: imageUrl,
      isDraft: isDraft === "true",
    });

    if (result) {
      return NextResponse.json(
        { success: true, value: result },
        { status: 200 }
      );
    }
    return NextResponse.json(
      { success: false, error: "Unable to update about content" },
      { status: 500 }
    );
  } catch (err) {
    console.warn(err);
    return NextResponse.json(
      {
        success: false,
        error: "Unable to update about content",
      },
      { status: 500 }
    );
  }
}
