import { NextResponse } from "next/server";
import axios from "axios";

export async function POST(req: Request) {
  const {
    paymentAmount,
    email,
    firstName,
    lastName,
    phone,
    institutionName,
    auctionId,
  } = await req.json();

  try {
    var raw = JSON.stringify({
      amount: paymentAmount,
      currency: "ETB",
      email: email,
      first_name: `${firstName ? firstName : institutionName}`,
      last_name: `${lastName ? lastName : ""}`,
      phone_number: `${phone}`,
      tx_ref: `dawuroda-auction-${Math.random()}`,
      callback_url: `${process.env.PAYMENT_WEB_HOOK}/api/webhook/payment`,
      return_url: `${process.env.PAYMENT_WEB_HOOK}/auctions/${auctionId}`,
      meta: {
        paymentType: "auctionPayment",
        auctionId,
        phone_number: phone,
      },
      "customization[title]": "DawuroDA Auction Payment",
      "customization[description]":
        "a pre payment to participate in an auction. this payment includes both cpo and non refundable payment for the auction ",
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
      { success: false, error: "Unable to create auction payment link" },
      { status: 500 }
    );
  } catch (err) {
    console.warn(err);
    return NextResponse.json(
      {
        success: false,
        error: "Unable to create auction payment link",
      },
      { status: 500 }
    );
  }
}
