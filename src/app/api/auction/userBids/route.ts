import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { UserRole } from "@prisma/client";
import { getServerSession } from "next-auth";
import { OPTIONS } from "@/util/authOptions";

export async function POST(req: Request) {
  const session = await getServerSession(OPTIONS);
  if (!session?.user.id) {
    return NextResponse.json(
      { success: false, value: "unauthorized user" },
      { status: 401 }
    );
  }
  if (!(session?.user.role === UserRole.Member)) {
    return NextResponse.json(
      { success: false, value: "unauthorized user" },
      { status: 401 }
    );
  }

  try {
    const result = await prisma.bidder.findMany({
      where: { memberId: session.user.id },
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
        error: "Unable to fetch auctions",
      },
      { status: 500 }
    );
  }
}
