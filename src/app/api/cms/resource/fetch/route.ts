import { NextResponse } from "next/server";
import { fetchResources } from "@/db/resource";
import { isStaffSession } from "@/util/session";

export async function POST(req: Request) {
  const { page, pageSize, searchText } = await req.json();

  try {
    const includeDrafts = await isStaffSession();
    const result = await fetchResources({
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
        error: "Unable to fetch resources",
      },
      { status: 500 }
    );
  }
}
