import { NextResponse } from "next/server";
import axios from "axios";

export async function POST(req: Request) {
  const {
    contributionAmount,
    email,
    firstName,
    lastName,
    phone,
    institutionName,
  } = await req.json();

  try {
    var raw = JSON.stringify({
      amount: contributionAmount,
      currency: "ETB",
      email: email,
      first_name: `${firstName ? firstName : institutionName}`,
      last_name: `${lastName ? lastName : ""}`,
      phone_number: `${phone}`,
      tx_ref: `gammoda-reg-${Math.random()}`,
      callback_url: `${process.env.PAYMENT_WEB_HOOK}/api/webhook/payment`,
      return_url: `${process.env.PAYMENT_WEB_HOOK}/login`,
      meta: {
        paymentType: "registrationPayment",
        phone_number: phone,
      },
      "customization[title]": "Gammoda member's registration",
      "customization[description]":
        "this membership registration should be paid after compeletion of your registration ",
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
      { success: false, error: "Unable to create registration payment link" },
      { status: 500 }
    );
  } catch (err) {
    console.warn(err);
    return NextResponse.json(
      {
        success: false,
        error: "Unable to create registration payment link",
      },
      { status: 500 }
    );
  }
}
