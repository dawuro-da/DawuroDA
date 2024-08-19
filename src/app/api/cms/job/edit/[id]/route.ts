import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { UserRole } from "@prisma/client";
import { OPTIONS } from "@/util/authOptions";
import { updateJob } from "@/db/job";
import { uploadFile } from "@/util/uploadFile";

export async function POST(req: Request, context: { params: { id: string } }) {
  const session = await getServerSession(OPTIONS);
  if (!session?.user?.id || session?.user.role === UserRole.Member) {
    return NextResponse.redirect("/gaadmin/login", 401);
  }
  const formData = await req.formData();
  const isDraft = formData.get("isDraft") as string;
  const jobTitle = formData.get("jobTitle") as string;
  const jobDescription = formData.get("jobDescription") as string;
  const document = formData.get("document") as File;
  const jobDescriptionAmharic = formData.get("jobDescriptionAmharic") as string;
  const jobTitleAmharic = formData.get("jobTitleAmharic") as string;
  const jobId = context.params.id;

  try {
    const imageUrl = document.name
      ? await uploadFile({
          path: "/jobDocs",
          fileName: document.name ?? "name",
          file: document,
          mimeType: document.type,
        })
      : (document as unknown as string);

    const result = await updateJob({
      jobTitle,
      jobDescription,
      jobDescriptionAmharic,
      jobTitleAmharic,
      id: jobId,
      document: imageUrl ? imageUrl : "",
      isDraft: isDraft === "true" ? true : false,
    });

    if (result) {
      return NextResponse.json(
        { success: true, value: result },
        { status: 200 }
      );
    }
    return NextResponse.json(
      { success: false, error: "Unable to update job" },
      { status: 500 }
    );
  } catch (err) {
    console.warn(err);
    return NextResponse.json(
      {
        success: false,
        error: "Unable to update job",
      },
      { status: 500 }
    );
  }
}
