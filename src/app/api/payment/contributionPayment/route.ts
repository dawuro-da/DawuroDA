import { NextResponse } from "next/server";
import axios from "axios";
import { sanitizeChapaText } from "@/util/chapa";

export async function POST(req: Request) {
  const {
    contributionAmount,
    email,
    firstName,
    lastName,
    phone,
    institutionName,
    membershipLevel,
    contributionSystem,
  } = await req.json();

  try {
    var raw = JSON.stringify({
      amount: contributionAmount,
      currency: "ETB",
      email: email,
      first_name: `${firstName ? firstName : institutionName}`,
      last_name: `${lastName ? lastName : ""}`,
      phone_number: `${phone}`,
      tx_ref: `dawuroda-contribution-${Math.random()}`,
      callback_url: `${process.env.PAYMENT_WEB_HOOK}/api/webhook/payment`,
      return_url: `${process.env.PAYMENT_WEB_HOOK}/member/dashboard`,
      meta: {
        paymentType: "contributionPayment",
        phone_number: phone,
      },
      customization: {
        title: "Contribution",
        description: sanitizeChapaText(
          [contributionSystem, membershipLevel, "membership contribution"]
            .filter(Boolean)
            .join(" "),
          50
        ),
      },
    });
    const res = await axios.post(
      "https://api.chapa.co/v1/transaction/initialize",
      raw,
      {
        headers: {
          Authorization: `Bearer ${process.env.CHAPA_SECRET_KEY}`,
          "Content-Type": "application/json",
        },
      }
    );
    if (res) {
      return NextResponse.json(
        { success: true, value: res.data },
        { status: 200 }
      );
    }
    return NextResponse.json(
      { success: false, error: "Unable to create contribution payment link" },
      { status: 500 }
    );
  } catch (err) {
    console.warn(err);
    return NextResponse.json(
      {
        success: false,
        error: "Unable to create contribution payment link",
      },
      { status: 500 }
    );
  }
}
