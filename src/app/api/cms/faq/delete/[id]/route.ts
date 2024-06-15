import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { OPTIONS } from "@/util/authOptions";
import { deleteFaq, findFaqById } from "@/db/faq";

export async function DELETE(
  req: Request,
  context: { params: { id: string } }
) {
  const session = await getServerSession(OPTIONS);
  if (!session?.user?.id) {
    return NextResponse.json(
      { success: false, error: "Unauthorized user" },
      { status: 401 }
    );
  }

  const faqId = context.params.id;

  const faq = await findFaqById(faqId);

  if (!faq) {
    return NextResponse.json(
      {
        success: false,
        error: "faq doesn't exist",
      },
      { status: 409 }
    );
  } else {
    try {
      const result = await deleteFaq({ id: faqId });

      if (result) {
        return NextResponse.json(
          { success: true, value: "ok" },
          { status: 200 }
        );
      }
      return NextResponse.json(
        {
          success: false,
          error: "Unable to delete faq",
        },
        { status: 500 }
      );
    } catch (err) {
      console.warn(err);
      return NextResponse.json(
        {
          success: false,
          error: "Unable to delete faq",
        },
        { status: 500 }
      );
    }
  }
}
