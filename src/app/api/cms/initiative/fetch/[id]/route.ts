import { NextResponse } from "next/server";
import { findInitiativeById } from "@/db/initiative";

export async function POST(req: Request, context: { params: { id: string } }) {
  const initiativeId = context.params.id;
  try {
    const result = await findInitiativeById(initiativeId);

    if (result) {
      return NextResponse.json(
        { success: true, value: { initiative: result } },
        { status: 200 }
      );
    }
  } catch (err) {
    console.warn(err);
    return NextResponse.json(
      {
        success: false,
        error: "Unable to fetch initiative",
      },
      { status: 500 }
    );
  }
}
