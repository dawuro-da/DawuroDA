import { NextResponse } from "next/server";
import { fetchAuctions } from "@/db/auction";

export async function POST(req: Request) {
  const { page, pageSize, filters } = await req.json();

  try {
    const result = await fetchAuctions({ page, pageSize, filters });

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
        error: "Unable to fetch auctions",
      },
      { status: 500 }
    );
  }
}
