import { NextResponse } from "next/server";
import { cookies } from "next/headers";

export async function POST(req: Request) {
  const { OTP } = await req.json();

  try {
    const result = cookies().get("memberRegOTP");

    if (result?.value.toString() === OTP.toString()) {
      return NextResponse.json(
        { success: true, value: "Successfully Verified" },
        { status: 200 }
      );
    }
  } catch (err) {
    console.warn(err);
    return NextResponse.json(
      {
        success: false,
        error: "Unable to request forgot password",
      },
      { status: 500 }
    );
  }
}
