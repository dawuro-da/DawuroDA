import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { UserRole } from "@prisma/client";
import { OPTIONS } from "@/util/authOptions";
import { updatePartnership } from "@/db/partnership";
import { uploadFile } from "@/util/uploadFile";

export async function POST(req: Request, context: { params: { id: string } }) {
  const session = await getServerSession(OPTIONS);
  if (!session?.user?.id || session?.user.role === UserRole.Member) {
    return NextResponse.json(
      { success: false, error: "Unauthorized user" },
      { status: 401 }
    );
  }
  const partnershipId = context.params.id;
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

    const result = await updatePartnership({
      partnerName,
      isDraft: isDraft === "true" ? true : false,
      partnerNameAmharic,
      logo: imageUrl ?? "",
      bio,
      bioAmharic,
      id: partnershipId,
    });

    if (result) {
      return NextResponse.json(
        { success: true, value: result },
        { status: 200 }
      );
    }
    return NextResponse.json(
      { success: false, error: "Unable to update partnership" },
      { status: 500 }
    );
  } catch (err) {
    console.warn(err);
    return NextResponse.json(
      {
        success: false,
        error: "Unable to update partnership",
      },
      { status: 500 }
    );
  }
}
