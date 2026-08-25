import { NextResponse } from "next/server";
import { fetchAboutContents } from "@/db/aboutContent";
import { isStaffSession } from "@/util/session";

export async function POST() {
  try {
    const includeDrafts = await isStaffSession();
    const result = await fetchAboutContents({ includeDrafts });

    return NextResponse.json(
      { success: true, value: { aboutContents: result } },
      { status: 200 }
    );
  } catch (err) {
    console.warn(err);
    return NextResponse.json(
      {
        success: false,
        error: "Unable to fetch about content",
      },
      { status: 500 }
    );
  }
}
