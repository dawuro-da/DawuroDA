import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { createAuction } from "@/db/auction";
import { OPTIONS } from "@/util/authOptions";
import { uploadFile } from "@/util/uploadFile";

export async function POST(req: Request) {
  const session = await getServerSession(OPTIONS);
  if (!session?.user?.id) {
    return NextResponse.redirect("/gaadmin/login", 401);
  }

  try {
    const formData = await req.formData();
    const formFile = formData.get("formFile") as File;
    const formPayment = formData.get("formPayment") as string;
    const CPO = formData.get("CPO") as string;
    const description = formData.get("description") as string;
    const title = formData.get("title") as string;
    const startDate = formData.get("startDate") as string;
    const endDate = formData.get("endDate") as string;
    const isPurchasing = formData.get("isPurchasing") as string;

    const fileUrl = formFile?.name
      ? await uploadFile({
          path: "/auctionFile",
          fileName: formFile.name ?? "name",
          file: formFile,
          mimeType: formFile.type,
        })
      : (formFile as unknown as string);

    const result = await createAuction({
      CPO,
      description,
      title,
      startDate,
      endDate,
      formPayment,
      isPurchasing: isPurchasing === "true" ? true : false,
      formFile: fileUrl ?? "",
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
        error: "Unable to create event",
      },
      { status: 500 }
    );
  } catch (err) {
    console.warn(err);
    return NextResponse.json(
      {
        success: false,
        error: "Unable to create event",
      },
      { status: 500 }
    );
  }
}
