import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { UserRole } from "@prisma/client";
import { OPTIONS } from "@/util/authOptions";
import { findManagementById, updateManagement } from "@/db/management";
import { uploadFile, deleteOldFile } from "@/util/uploadFile";

export async function POST(req: Request, context: { params: { id: string } }) {
  const session = await getServerSession(OPTIONS);
  if (!session?.user?.id || session?.user.role === UserRole.Member) {
    return NextResponse.redirect("/daadmin/login", 401)
  }
  const managementId = context.params.id;

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
    const existing = await findManagementById(managementId);
    let imageUrl: string;
    if (photo.name) {
      imageUrl = await uploadFile({
        path: "/managementPhoto",
        fileName: photo.name ?? "name",
        file: photo,
        mimeType: photo.type,
      });
      await deleteOldFile(existing?.photo);
    } else {
      imageUrl = photo as unknown as string;
    }

    const result = await updateManagement({
      managerName,
      managerNameAmharic,
      job,
      isDraft: isDraft === "true" ? true : false,
      jobAmharic,
      photo: imageUrl ?? "",
      bio,
      bioAmharic,
      id: managementId,
      isBoardMember: isBoardMember === "true" ? true : false,
    });

    if (result) {
      return NextResponse.json(
        { success: true, value: result },
        { status: 200 }
      );
    }
    return NextResponse.json(
      { success: false, error: "Unable to update management" },
      { status: 500 }
    );
  } catch (err) {
    console.warn(err);
    return NextResponse.json(
      {
        success: false,
        error: "Unable to update management",
      },
      { status: 500 }
    );
  }
}
