import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { OPTIONS } from "../../auth/[...nextauth]/route";
import { fetchUsers } from "@/db/user";

export async function GET(req: Request) {
  const session = await getServerSession(OPTIONS);
  if (!session?.user.id) {
    return NextResponse.json(
      { success: false, error: "Unauthorized user" },
      { status: 401 }
    );
  }

  try {
    const result = await fetchUsers({ page: 1, pageSize: 5 });

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
