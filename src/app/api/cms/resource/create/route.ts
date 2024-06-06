import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { OPTIONS } from "@/app/api/auth/[...nextauth]/route";
import { createResource } from "@/db/resource";

export async function POST(req: Request) {
  const session = await getServerSession(OPTIONS);
  if (!session?.user.id) {
    return NextResponse.json(
      { success: false, error: "Unauthorized user" },
      { status: 401 }
    );
  }

  const { name, description, document } = await req.json();
  try {
    const result = await createResource({
      name,
      description,
      document,
    });

    if (result) {
      return NextResponse.json(
        { success: true, value: result },
        { status: 200 }
      );
    }
    return NextResponse.json(
      {
        success: false,
        error: "Unable to create resource",
      },
      { status: 500 }
    );
  } catch (err) {
    console.warn(err);
    return NextResponse.json(
      {
        success: false,
        error: "Unable to create resource",
      },
      { status: 500 }
    );
  }
}
