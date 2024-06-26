import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { OPTIONS } from "@/util/authOptions";
import { createResource } from "@/db/resource";
import { uploadFile } from "@/util/uploadFile";

export async function POST(req: Request) {
  const session = await getServerSession(OPTIONS);
  if (!session?.user?.id) {
    return NextResponse.redirect("/gaadmin/login", 401)
  }

  try {
    const formData = await req.formData();
    const name = formData.get("name") as string;
    const description = formData.get("description") as string;
    const document = formData.get("document") as File;
    const isDraft = formData.get("isDraft") as string;

    const imageUrl = document.name
      ? await uploadFile({
          path: "/resourceDocs",
          fileName: document.name ?? "name",
          file: document,
          mimeType: document.type,
        })
      : (document as unknown as string);

    const result = await createResource({
      name,
      description,
      document: imageUrl ?? "",
      isDraft: isDraft === "true" ? true : false,
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
