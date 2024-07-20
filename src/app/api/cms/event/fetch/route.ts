import { NextResponse } from "next/server";
import { fetchEvents } from "@/db/event";

export async function POST(req: Request) {
  const { page, pageSize, searchText, upcoming } = await req.json();

  try {
    const result = await fetchEvents({ page, pageSize, searchText, upcoming });

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
        error: "Unable to fetch events",
      },
      { status: 500 }
    );
  }
}
