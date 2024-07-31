import { NextResponse } from "next/server";
import { fetchAuctions } from "@/db/auction";
import { uploadFile } from "@/util/uploadFile";
import prisma from "@/lib/prisma";
import { getServerSession } from "next-auth";
import { OPTIONS } from "@/util/authOptions";

export async function POST(req: Request) {
  const session = await getServerSession(OPTIONS);
  if (!session?.user?.id) {
    return NextResponse.redirect("/login", 401);
  }

  const formData = await req.formData();
  const offer = formData.get("offer") as string;
  const formFilled = formData.get("formFilled") as File;
  const bidderId = formData.get("bidderId") as string;

  try {
    const fileUrl = await uploadFile({
      path: "/auctionFile",
      fileName: formFilled.name ?? "name",
      file: formFilled,
      mimeType: formFilled.type,
    });

    const result = await prisma.bidder.update({
      where: { id: bidderId },
      data: {
        offer: parseFloat(offer),
        filledForm: fileUrl,
        isSubmitted: true,
      },
    });

    if (result) {
      return NextResponse.json(
        { success: true, value: "Successfully Submitted" },
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
