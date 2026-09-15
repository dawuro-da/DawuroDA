import { NextResponse } from "next/server";
import { findAuctionById } from "@/db/auction";
import {
  chapaErrorMessage,
  initializeChapaTransaction,
  sanitizeChapaText,
} from "@/util/chapa";

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
    const auction = auctionId ? await findAuctionById(auctionId) : null;

    const res = await initializeChapaTransaction("auction", (txRef) => ({
      amount: paymentAmount,
      currency: "ETB",
      email: email,
      first_name: `${firstName ? firstName : institutionName}`,
      last_name: `${lastName ? lastName : ""}`,
      phone_number: `${phone}`,
      tx_ref: txRef,
      callback_url: `${process.env.PAYMENT_WEB_HOOK}/api/webhook/payment`,
      return_url: `${process.env.PAYMENT_WEB_HOOK}/auctions/${auctionId}`,
      meta: {
        paymentType: "auctionPayment",
        auctionId,
        phone_number: phone,
      },
      customization: {
        title: "Auction Payment",
        description: auction
          ? sanitizeChapaText(
              `CPO payment for ${auction.title} auction`,
              50
            )
          : "CPO and auction participation payment",
      },
    }));
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
  } catch (err: any) {
    console.warn(err?.response?.data ?? err);
    return NextResponse.json(
      {
        success: false,
        error: chapaErrorMessage(err, "Unable to create auction payment link"),
      },
      { status: 500 }
    );
  }
}
