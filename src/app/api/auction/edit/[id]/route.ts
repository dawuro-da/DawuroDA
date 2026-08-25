import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { UserRole } from "@prisma/client";
import { OPTIONS } from "@/util/authOptions";
import { updateAuction } from "@/db/auction";
import { uploadFile } from "@/util/uploadFile";

export async function POST(req: Request, context: { params: { id: string } }) {
  const session = await getServerSession(OPTIONS);
  if (!session?.user?.id || session?.user.role === UserRole.Member) {
    return NextResponse.redirect("/daadmin/login", 401);
  }

  const auctionId = context.params.id;

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

    const result = await updateAuction({
      CPO,
      formPayment,
      description,
      title,
      startDate,
      endDate,
      id: auctionId,
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
      { success: false, error: "Unable to update auction" },
      { status: 500 }
    );
  } catch (err) {
    console.warn(err);
    return NextResponse.json(
      {
        success: false,
        error: "Unable to update auction",
      },
      { status: 500 }
    );
  }
}
