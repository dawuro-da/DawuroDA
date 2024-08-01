import { NextResponse } from "next/server";
import { fetchAuctionBidders } from "@/db/auction";

export async function POST(req: Request) {
  const { page, pageSize, auctionId } = await req.json();

  try {
    const result = await fetchAuctionBidders({ page, pageSize, auctionId });

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
