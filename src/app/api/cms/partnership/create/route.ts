import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { OPTIONS } from "@/util/authOptions";
import { createPartnership } from "@/db/partnership";
import { uploadFile } from "@/util/uploadFile";

export async function POST(req: Request) {
  const session = await getServerSession(OPTIONS);
  if (!session?.user?.id) {
    return NextResponse.json(
      { success: false, error: "Unauthorized user" },
      { status: 401 }
    );
  }

  const formData = await req.formData();
  const partnerName = formData.get("partnerName") as string;
  const isDraft = formData.get("isDraft") as string;
  const partnerNameAmharic = formData.get("partnerNameAmharic") as string;
  const logo = formData.get("logo") as File;
  const bio = formData.get("bio") as string;
  const bioAmharic = formData.get("bioAmharic") as string;

  try {
    const imageUrl = logo.name
      ? await uploadFile({
          path: "/logos",
          fileName: logo.name ?? "name",
          file: logo,
          mimeType: logo.type,
        })
      : (logo as unknown as string);

    const result = await createPartnership({
      partnerName,
      isDraft: isDraft === "true" ? true : false,
      partnerNameAmharic,
      logo: imageUrl ?? "",
      bio,
      bioAmharic,
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
        error: "Unable to create partnership",
      },
      { status: 500 }
    );
  } catch (err) {
    console.warn(err);
    return NextResponse.json(
      {
        success: false,
        error: "Unable to create partnership",
      },
      { status: 500 }
    );
  }
}
