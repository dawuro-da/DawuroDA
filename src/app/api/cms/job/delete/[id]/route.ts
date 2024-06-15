import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { OPTIONS } from "@/util/authOptions";
import { deleteJob, findJobById } from "@/db/job";

export async function DELETE(
  req: Request,
  context: { params: { id: string } }
) {
  const session = await getServerSession(OPTIONS);
  if (!session?.user?.id) {
    return NextResponse.json(
      { success: false, error: "Unauthorized user" },
      { status: 401 }
    );
  }

  const jobId = context.params.id;

  const job = await findJobById(jobId);

  if (!job) {
    return NextResponse.json(
      {
        success: false,
        error: "job doesn't exist",
      },
      { status: 409 }
    );
  } else {
    try {
      const result = await deleteJob({ id: jobId });

      if (result) {
        return NextResponse.json(
          { success: true, value: "ok" },
          { status: 200 }
        );
      }
      return NextResponse.json(
        {
          success: false,
          error: "Unable to delete job",
        },
        { status: 500 }
      );
    } catch (err) {
      console.warn(err);
      return NextResponse.json(
        {
          success: false,
          error: "Unable to delete job",
        },
        { status: 500 }
      );
    }
  }
}
