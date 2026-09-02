import { NextResponse } from "next/server";
import axios from "axios";
import { randomUUID } from "crypto";
import { sanitizeChapaText } from "@/util/chapa";

export async function POST(req: Request) {
  const {
    paymentAmount,
    fullName,
    phone,
    donationDesignation,
    branch,
    campaignId,
  } = await req.json();

  try {
    // This tx_ref also doubles as the donor's certificate access token (see
    // /donation-certificate), so it needs to be unguessable — crypto.randomUUID()
    // instead of the Math.random() pattern the other payment routes use.
    const txRef = `dawuroda-donation-${randomUUID()}`;

    var raw = JSON.stringify({
      amount: paymentAmount,
      currency: "ETB",
      email: "",
      first_name: `${fullName}`,
      last_name: ``,
      phone_number: `${phone}`,
      tx_ref: txRef,
      callback_url: `${process.env.PAYMENT_WEB_HOOK}/api/webhook/payment`,
      return_url: `${process.env.PAYMENT_WEB_HOOK}/donation-certificate?tx_ref=${txRef}`,
      meta: {
        paymentType: "donationPayment",
        donationDesignation: donationDesignation,
        branch: branch ?? "Other",
        phone_number: phone,
        campaignId: campaignId ?? "",
        txRef,
      },
      customization: {
        title: "Donation Payment",
        description: donationDesignation
          ? sanitizeChapaText(`Donation to ${donationDesignation}`, 50)
          : "Donation to Dawuro Development Association",
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
