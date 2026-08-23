import { NextResponse } from "next/server";
import axios from "axios";

export async function POST(req: Request) {
  const { paymentAmount, fullName, phone, donationDesignation, branch } =
    await req.json();

  try {
    var raw = JSON.stringify({
      amount: paymentAmount,
      currency: "ETB",
      email: "",
      first_name: `${fullName}`,
      last_name: ``,
      phone_number: `${phone}`,
      tx_ref: `dawuroda-donation-${Math.random()}`,
      callback_url: `${process.env.PAYMENT_WEB_HOOK}/api/webhook/payment`,
      return_url: ``,
      meta: {
        paymentType: "donationPayment",
        donationDesignation: donationDesignation,
        branch: branch ?? "Other",
        phone_number: phone,
      },
      "customization[title]": "DawuroDA Donation Payment",
      "customization[description]":
        "donation for gamo developement association for different voluntary works ",
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
      { success: false, error: "Unable to create donation payment link" },
      { status: 500 }
    );
  } catch (err) {
    console.warn(err);
    return NextResponse.json(
      {
        success: false,
        error: "Unable to create donation payment link",
      },
      { status: 500 }
    );
  }
}
