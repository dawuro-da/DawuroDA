import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { UserRole } from "@prisma/client";
import { OPTIONS } from "@/util/authOptions";
import { fetchAuctions } from "@/db/auction";

export async function POST(req: Request) {
  const session = await getServerSession(OPTIONS);
  if (!session?.user.id || session.user.role === UserRole.Member) {
    return NextResponse.json(
      { success: false, error: "Unauthorized user" },
      { status: 401 }
    );
  }

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
