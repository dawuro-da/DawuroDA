import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { OPTIONS } from "@/util/authOptions";
import { UserRole } from "@prisma/client";
import { fetchDonations } from "@/db/donation";

export async function POST(req: Request) {
  const session = await getServerSession(OPTIONS);
  if (!session?.user?.id || session.user.role === UserRole.Member) {
    return NextResponse.redirect("/gaadmin/login", 401)
  }

  const { page, pageSize, filters, searchText } = await req.json();

  try {
    const result = await fetchDonations({
      page,
      pageSize,
      filters,
      searchText,
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
        error: "Unable to fetch donations",
      },
      { status: 500 }
    );
  }
}
