import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { UserRole } from "@prisma/client";
import { OPTIONS } from "@/util/authOptions";
import { fetchCampaigns } from "@/db/campaign";

export async function POST(req: Request) {
  const session = await getServerSession(OPTIONS);
  if (!session?.user?.id || session.user.role === UserRole.Member) {
    return NextResponse.redirect("/gaadmin/login", 401)
  }

  const { page, pageSize, searchText } = await req.json();

  try {
    const result = await fetchCampaigns({ page, pageSize, searchText });

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
        error: "Unable to fetch campaigns",
      },
      { status: 500 }
    );
  }
}
