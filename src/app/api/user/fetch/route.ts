import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { OPTIONS } from "@/util/authOptions";
import { fetchUsers } from "@/db/user";
import { UserRole } from "@prisma/client";

export async function GET(req: Request) {
  const session = await getServerSession(OPTIONS);
  if (!session?.user?.id || !(session?.user.role === UserRole.Owner)) {
    return NextResponse.redirect("/daadmin/login", 401);
  }

  try {
    const result = await fetchUsers({ page: 1, pageSize: 30 });

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
        error: "Unable to fetch users",
      },
      { status: 500 }
    );
  }
}
