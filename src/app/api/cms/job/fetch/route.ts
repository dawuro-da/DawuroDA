import { NextResponse } from "next/server";
import { fetchJobs } from "@/db/job";
import { isStaffSession } from "@/util/session";

export async function POST(req: Request) {
  const includeDrafts = await isStaffSession();
  if (!includeDrafts) {
    return NextResponse.json(
      { success: false, error: "Unauthorized" },
      { status: 401 }
    );
  }

  const { page, pageSize, searchText } = await req.json();

  try {
    const result = await fetchJobs({
      page,
      pageSize,
      searchText,
      includeDrafts,
    });

    if (result) {
      return NextResponse.json(
        { success: true, value: result },
        { status: 200 }
      );
    }
  } catch (err) {
    console.warn(err);
    return NextResponse.json(
      {
        success: false,
        error: "Unable to fetch jobs",
      },
      { status: 500 }
    );
  }
}
