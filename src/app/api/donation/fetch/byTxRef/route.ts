import { NextResponse } from "next/server";
import { findDonationByTxRef } from "@/db/donation";

// Intentionally unauthenticated: a donor lands here straight from Chapa's
// checkout redirect, before ever logging in to anything. The tx_ref itself
// (a random UUID) is the access token — knowing it is what proves this is
// your own donation.
export async function POST(req: Request) {
  try {
    const { txRef } = await req.json();
    if (!txRef) {
      return NextResponse.json(
        { success: false, error: "Missing transaction reference" },
        { status: 400 }
      );
    }

    const donation = await findDonationByTxRef(txRef);
    if (!donation) {
      return NextResponse.json(
        { success: false, error: "Donation not found" },
        { status: 404 }
      );
    }

    return NextResponse.json(
      { success: true, value: donation },
      { status: 200 }
    );
  } catch (err) {
    console.warn(err);
    return NextResponse.json(
      { success: false, error: "Unable to fetch donation" },
      { status: 500 }
    );
  }
}
