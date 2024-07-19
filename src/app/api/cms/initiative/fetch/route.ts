import { NextResponse } from "next/server";
import { fetchInitiatives } from "@/db/initiative";

export async function POST(req: Request) {
  const { page, pageSize, searchText } = await req.json();

  try {
    const result = await fetchInitiatives({ page, pageSize, searchText });

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
        error: "Unable to fetch initiatives",
      },
      { status: 500 }
    );
  }
}
