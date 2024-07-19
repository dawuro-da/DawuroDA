import { NextResponse } from "next/server";
import { fetchFaqs } from "@/db/faq";

export async function POST(req: Request) {
  const { page, pageSize, searchText } = await req.json();

  try {
    const result = await fetchFaqs({ page, pageSize, searchText });

    if (result) {
      return NextResponse.json(
        { success: true, value: result },
        { status: 200 }
      );
    }
  } catch (err) {
    console.warn(err);
    return NextResponse.json(
      {
        success: false,
        error: "Unable to fetch faq",
      },
      { status: 500 }
    );
  }
}
