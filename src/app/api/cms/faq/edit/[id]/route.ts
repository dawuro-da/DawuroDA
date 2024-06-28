import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { UserRole } from "@prisma/client";
import { OPTIONS } from "@/util/authOptions";
import { updateFaq } from "@/db/faq";

export async function POST(req: Request, context: { params: { id: string } }) {
  const session = await getServerSession(OPTIONS);
  if (!session?.user?.id || session?.user.role === UserRole.Member) {
    return NextResponse.redirect("/gaadmin/login", 401)
  }
  const { question, answer, isDraft } = await req.json();
  const faqId = context.params.id;

  try {
    const result = await updateFaq({
      question,
      answer,
      id: faqId,
      isDraft,
    });

    if (result) {
      return NextResponse.json(
        { success: true, value: result },
        { status: 200 }
      );
    }
    return NextResponse.json(
      { success: false, error: "Unable to update faq" },
      { status: 500 }
    );
  } catch (err) {
    console.warn(err);
    return NextResponse.json(
      {
        success: false,
        error: "Unable to update faq",
      },
      { status: 500 }
    );
  }
}
