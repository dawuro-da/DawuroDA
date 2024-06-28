import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { UserRole } from "@prisma/client";
import { OPTIONS } from "@/util/authOptions";
import { updateResource } from "@/db/resource";
import { uploadFile } from "@/util/uploadFile";

export async function POST(req: Request, context: { params: { id: string } }) {
  const session = await getServerSession(OPTIONS);
  if (!session?.user?.id || session?.user.role === UserRole.Member) {
    return NextResponse.redirect("/gaadmin/login", 401)
  }

  const resourceId = context.params.id;

  try {
    const formData = await req.formData();
    const name = formData.get("name") as string;
    const description = formData.get("description") as string;
    const document = formData.get("document") as File;
    const isDraft = formData.get("isDraft") as string;

    const imageUrl = document.name
      ? await uploadFile({
          path: "/resourceDocs",
          fileName: document.name,
          file: document,
          mimeType: document.type,
        })
      : (document as unknown as string);

    const result = await updateResource({
      name,
      isDraft: isDraft === "true" ? true : false,
      description,
      document: imageUrl ?? "",
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
