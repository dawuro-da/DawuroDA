import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { OPTIONS } from "@/app/api/auth/[...nextauth]/route";
import { createJob } from "@/db/job";

export async function POST(req: Request) {
  const session = await getServerSession(OPTIONS);
  if (!session?.user.id) {
    return NextResponse.json(
      { success: false, error: "Unauthorized user" },
      { status: 401 }
    );
  }

  const { jobTitle, jobDescription, jobDescriptionAmharic, jobTitleAmharic } =
    await req.json();
  try {
    const result = await createJob({
      jobTitle,
      jobDescription,
      jobDescriptionAmharic,
      jobTitleAmharic,
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
