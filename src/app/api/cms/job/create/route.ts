import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { OPTIONS } from "@/util/authOptions";
import { createJob } from "@/db/job";
import { uploadFile } from "@/util/uploadFile";
import { UserRole } from "@prisma/client";

export async function POST(req: Request) {
  const session = await getServerSession(OPTIONS);
  if (!session?.user?.id && session?.user.role === UserRole.Member) {
    return NextResponse.redirect("/daadmin/login", 401);
  }

  const formData = await req.formData();
  const isDraft = formData.get("isDraft") as string;
  const jobTitle = formData.get("jobTitle") as string;
  const jobDescription = formData.get("jobDescription") as string;
  const document = formData.get("document") as File;
  const jobDescriptionAmharic = formData.get("jobDescriptionAmharic") as string;
  const jobTitleAmharic = formData.get("jobTitleAmharic") as string;
  const deadlineDate = formData.get("deadlineDate") as string;

  try {
    const imageUrl = document.name
      ? await uploadFile({
          path: "/jobDocs",
          fileName: document.name ?? "name",
          file: document,
          mimeType: document.type,
        })
      : (document as unknown as string);

    const result = await createJob({
      jobTitle,
      jobDescription,
      jobDescriptionAmharic,
      jobTitleAmharic,
      document: imageUrl ? imageUrl : "",
      isDraft: isDraft === "true" ? true : false,
      deadlineDate,
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
        error: "Unable to create job",
      },
      { status: 500 }
    );
  } catch (err) {
    console.warn(err);
    return NextResponse.json(
      {
        success: false,
        error: "Unable to create job",
      },
      { status: 500 }
    );
  }
}
