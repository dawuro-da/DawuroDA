import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { OPTIONS } from "@/util/authOptions";
import { createNews } from "@/db/news";

export async function POST(req: Request) {
  const session = await getServerSession(OPTIONS);
  if (!session?.user.id) {
    return NextResponse.json(
      { success: false, error: "Unauthorized user" },
      { status: 401 }
    );
  }

  const {
    profileImage,
    isDraft,
    body,
    bodyAmharic,
    headline,
    headlineAmharic,
  } = await req.json();
  try {
    const result = await createNews({
      profileImage,
      body,
      bodyAmharic,
      headline,
      isDraft,
      headlineAmharic,
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
        error: "Unable to create news",
      },
      { status: 500 }
    );
  } catch (err) {
    console.warn(err);
    return NextResponse.json(
      {
        success: false,
        error: "Unable to create news",
      },
      { status: 500 }
    );
  }
}
