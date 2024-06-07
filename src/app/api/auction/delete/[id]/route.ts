import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { OPTIONS } from "@/app/api/auth/[...nextauth]/route";
import { deleteAuction, findAuctionById } from "@/db/auction";

export async function DELETE(
  req: Request,
  context: { params: { id: string } }
) {
  const session = await getServerSession(OPTIONS);
  if (!session?.user.id) {
    return NextResponse.json(
      { success: false, error: "Unauthorized user" },
      { status: 401 }
    );
  }

  const auctionId = context.params.id;

  const auction = await findAuctionById(auctionId);

  if (!auction) {
    return NextResponse.json(
      {
        success: false,
        error: "auction doesn't exist",
      },
      { status: 409 }
    );
  } else {
    try {
      const result = await deleteAuction({ id: auctionId });

      if (result) {
        return NextResponse.json(
          { success: true, value: "ok" },
          { status: 200 }
        );
      }
      return NextResponse.json(
        {
          success: false,
          error: "Unable to delete auction",
        },
        { status: 500 }
      );
    } catch (err) {
      console.warn(err);
      return NextResponse.json(
        {
          success: false,
          error: "Unable to delete auction",
        },
        { status: 500 }
      );
    }
  }
}
