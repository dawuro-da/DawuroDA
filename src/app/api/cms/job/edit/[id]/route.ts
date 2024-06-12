import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { UserRole } from "@prisma/client";
import { OPTIONS } from "@/util/authOptions";
import { updateJob } from "@/db/job";

export async function POST(req: Request, context: { params: { id: string } }) {
  const session = await getServerSession(OPTIONS);
  if (!session?.user.id || session?.user.role === UserRole.Member) {
    return NextResponse.json(
      { success: false, error: "Unauthorized user" },
      { status: 401 }
    );
  }
  const { jobTitle, jobDescription, jobDescriptionAmharic, jobTitleAmharic } =
    await req.json();
  const jobId = context.params.id;

  try {
    const result = await updateJob({
      jobTitle,
      jobDescription,
      jobDescriptionAmharic,
      jobTitleAmharic,
      id: jobId,
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
