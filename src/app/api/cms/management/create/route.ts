import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { OPTIONS } from "@/util/authOptions";
import { createManagement } from "@/db/management";
import { uploadFile } from "@/util/uploadFile";

export async function POST(req: Request) {
  const session = await getServerSession(OPTIONS);
  if (!session?.user?.id) {
    return NextResponse.redirect("/daadmin/login", 401)
  }

  try {
    const formData = await req.formData();
    const managerName = formData.get("managerName") as string;
    const managerNameAmharic = formData.get("managerNameAmharic") as string;
    const job = formData.get("job") as string;
    const jobAmharic = formData.get("jobAmharic") as string;
    const photo = formData.get("photo") as File;
    const bio = formData.get("bio") as string;
    const bioAmharic = formData.get("bioAmharic") as string;
    const isDraft = formData.get("isDraft") as string;
    const isBoardMember = formData.get("isBoardMember") as string;
    const imageUrl = photo.name
      ? await uploadFile({
          path: "/managementPhoto",
          fileName: photo.name ?? "name",
          file: photo,
          mimeType: photo.type,
        })
      : (photo as unknown as string);

    const result = await createManagement({
      managerName,
      isDraft: isDraft === "true" ? true : false,
      managerNameAmharic,
      job,
      jobAmharic,
      photo: imageUrl ?? "",
      bio,
      bioAmharic,
      isBoardMember: isBoardMember === "true" ? true : false,
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
        error: "Unable to create management",
      },
      { status: 500 }
    );
  } catch (err) {
    console.warn(err);
    return NextResponse.json(
      {
        success: false,
        error: "Unable to create management",
      },
      { status: 500 }
    );
  }
}
