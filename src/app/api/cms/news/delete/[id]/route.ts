import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { OPTIONS } from "@/app/api/auth/[...nextauth]/route";
import { deleteNews, findNewsById } from "@/db/news";

export async function DELETE(
  req: Request,
  context: { params: { id: string } }
) {
  const session = await getServerSession(OPTIONS);
  if (!session?.user.id) {
    return NextResponse.json(
      { success: false, error: "Unauthorized user" },
      { status: 401 }
    );
  }

  const newsId = context.params.id;

  const news = await findNewsById(newsId);

  if (!news) {
    return NextResponse.json(
      {
        success: false,
        error: "news doesn't exist",
      },
      { status: 409 }
    );
  } else {
    try {
      const result = await deleteNews({ id: newsId });

      if (result) {
        return NextResponse.json(
          { success: true, value: "ok" },
          { status: 200 }
        );
      }
      return NextResponse.json(
        {
          success: false,
          error: "Unable to delete news",
        },
        { status: 500 }
      );
    } catch (err) {
      console.warn(err);
      return NextResponse.json(
        {
          success: false,
          error: "Unable to delete news",
        },
        { status: 500 }
      );
    }
  }
}
