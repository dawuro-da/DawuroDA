import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { OPTIONS } from "@/util/authOptions";
import { deleteResource, findResourceById } from "@/db/resource";

export async function DELETE(
  req: Request,
  context: { params: { id: string } }
) {
  const session = await getServerSession(OPTIONS);
  if (!session?.user?.id) {
    return NextResponse.json(
      { success: false, error: "Unauthorized" },
      { status: 401 }
    );
  }

  const resourceId = context.params.id;

  const resource = await findResourceById(resourceId);

  if (!resource) {
    return NextResponse.json(
      {
        success: false,
        error: "resource doesn't exist",
      },
      { status: 409 }
    );
  } else {
    try {
      const result = await deleteResource({ id: resourceId });

      if (result) {
        return NextResponse.json(
          { success: true, value: "ok" },
          { status: 200 }
        );
      }
      return NextResponse.json(
        {
          success: false,
          error: "Unable to delete resource",
        },
        { status: 500 }
      );
    } catch (err) {
      console.warn(err);
      return NextResponse.json(
        {
          success: false,
          error: "Unable to delete resource",
        },
        { status: 500 }
      );
    }
  }
}
