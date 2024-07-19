import { NextResponse } from "next/server";
import { findNewsById } from "@/db/news";

export async function POST(req: Request, context: { params: { id: string } }) {
  const newsId = context.params.id;
  try {
    const result = await findNewsById(newsId);

    if (result) {
      return NextResponse.json(
        { success: true, value: { news: result } },
        { status: 200 }
      );
    }
  } catch (err) {
    console.warn(err);
    return NextResponse.json(
      {
        success: false,
        error: "Unable to fetch news",
      },
      { status: 500 }
    );
  }
}
