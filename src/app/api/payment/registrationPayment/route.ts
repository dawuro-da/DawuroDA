import { NextResponse } from "next/server";
import {
  chapaErrorMessage,
  initializeChapaTransaction,
  sanitizeChapaText,
} from "@/util/chapa";

export async function POST(req: Request) {
  const {
    contributionAmount,
    email,
    firstName,
    lastName,
    phone,
    institutionName,
    membershipLevel,
  } = await req.json();

  try {
    const res = await initializeChapaTransaction("reg", (txRef) => ({
      amount: contributionAmount,
      currency: "ETB",
      email: email,
      first_name: `${firstName ? firstName : institutionName}`,
      last_name: `${lastName ? lastName : ""}`,
      phone_number: `${phone}`,
      tx_ref: txRef,
      callback_url: `${process.env.PAYMENT_WEB_HOOK}/api/webhook/payment`,
      return_url: `${process.env.PAYMENT_WEB_HOOK}/login`,
      meta: {
        paymentType: "registrationPayment",
        phone_number: phone,
      },
      customization: {
        title: "Registration",
        description: membershipLevel
          ? sanitizeChapaText(
              `${membershipLevel} membership registration payment`,
              50
            )
          : "Membership registration payment",
      },
    }));
    if (res) {
      return NextResponse.json(
        { success: true, value: res.data },
        { status: 200 }
      );
    }
    return NextResponse.json(
      { success: false, error: "Unable to create registration payment link" },
      { status: 500 }
    );
  } catch (err: any) {
    console.warn(err?.response?.data ?? err);
    return NextResponse.json(
      {
        success: false,
        error: chapaErrorMessage(
          err,
          "Unable to create registration payment link"
        ),
      },
      { status: 500 }
    );
  }
}
