import { NextResponse } from "next/server";
import { findJobById } from "@/db/job";

export async function POST(req: Request, context: { params: { id: string } }) {
  const jobId = context.params.id;
  try {
    const result = await findJobById(jobId);

    if (result) {
      return NextResponse.json(
        { success: true, value: { job: result } },
        { status: 200 }
      );
    }
  } catch (err) {
    console.warn(err);
    return NextResponse.json(
      {
        success: false,
        error: "Unable to fetch job detail",
      },
      { status: 500 }
    );
  }
}
