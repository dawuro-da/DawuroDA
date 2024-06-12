import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { UserRole } from "@prisma/client";
import { OPTIONS } from "@/util/authOptions";
import { updateResource } from "@/db/resource";

export async function POST(req: Request, context: { params: { id: string } }) {
  const session = await getServerSession(OPTIONS);
  if (!session?.user.id || session?.user.role === UserRole.Member) {
    return NextResponse.json(
      { success: false, error: "Unauthorized user" },
      { status: 401 }
    );
  }
  const { name, description, document } = await req.json();
  const resourceId = context.params.id;

  try {
    const result = await updateResource({
      name,
      description,
      document,
      id: resourceId,
    });

    if (result) {
      return NextResponse.json(
        { success: true, value: result },
        { status: 200 }
      );
    }
    return NextResponse.json(
      { success: false, error: "Unable to update resource" },
      { status: 500 }
    );
  } catch (err) {
    console.warn(err);
    return NextResponse.json(
      {
        success: false,
        error: "Unable to update resource",
      },
      { status: 500 }
    );
  }
}
