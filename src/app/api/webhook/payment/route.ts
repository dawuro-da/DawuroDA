import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { Auction, Member } from "@prisma/client";
import { findMemberByPhone } from "@/db/member";
import { createDonation } from "@/db/donation";
import { findAuctionById } from "@/db/auction";
import { createAuditLog } from "@/db/auditLog";
import {
  applyContributionPayment,
  applyRegistrationPayment,
} from "@/db/payment";

// Chapa pings this URL to check reachability when the webhook is
// registered/saved in the dashboard, before it ever sends a real POST
// event. Without a GET handler, Next.js returns 405 for that check.
export async function GET() {
  return NextResponse.json({ success: "OK" }, { status: 200 });
}

export async function POST(req: Request, res: any) {
  try {
    const body = await req.json();
    const { event, mobile, meta, amount, first_name } = body;

    // Chapa's docs list several possible values for `type` depending on how
    // the transaction was initiated (Payment Link, API, Event, Donation…).
    // We always initiate via their /v1/transaction/initialize REST API, but
    // requiring type === "API" turned out to reject real successful charges
    // whenever Chapa classified one differently — silently dropping
    // donations, contributions, auction bids, and new member registrations
    // alike, all of which route through this same handler. event ===
    // "charge.success" alone is the correct signal that a payment succeeded.
    if (event === "charge.success") {
      const metaData = JSON.parse(JSON.stringify(meta));
      
      const paymentType = metaData?.paymentType ?? "";
      const auctionId = metaData?.auctionId ?? "";
      const donationDesignation = metaData?.donationDesignation ?? "";
      const branch = metaData?.branch ?? "";
      const phone_number = metaData?.phone_number ?? mobile;
      const campaignId = metaData?.campaignId || undefined;
      const txRef = metaData?.txRef || undefined;

      if (paymentType === "registrationPayment") {
        const existingMember = await findMemberByPhone(phone_number);
        if (existingMember && !existingMember.hasPaid) {
          const member = await applyRegistrationPayment(existingMember);
          if (member) {
            await createAuditLog({
              entityType: "Member",
              entityId: member.id,
              entityLabel:
                member.institutionName ||
                `${member.firstName ?? ""} ${member.lastName ?? ""}`.trim() ||
                "Unknown",
              action: "UPDATE",
              changes: {
                hasPaid: { from: false, to: true },
              },
              performedByName: "Chapa payment",
              performedByRole: "System",
            });
          }
        }
      } else if (paymentType === "contributionPayment") {
        const member = await findMemberByPhone(phone_number);
        if (member) {
          await applyContributionPayment(member, amount);
        }
      } else if (paymentType === "auctionPayment") {
        const member = await findMemberByPhone(phone_number);
        const auction = auctionId && (await findAuctionById(auctionId));
        if (member) {
          await addNewBidder({ member, auction });
        }
      } else if (paymentType === "donationPayment")
        await createANewDonation({
          amount: amount,
          branch: branch,
          donationDesignation: donationDesignation,
          fullName: `${first_name ?? "Unknown"}`,
          phone: phone_number,
          campaignId,
          txRef,
        });
    }

    return NextResponse.json(
      {
        success: "OK",
      },
      { status: 200 }
    );
  } catch (error) {
    console.warn({ error });
    return NextResponse.json(
      {
        success: "Can't process payment",
      },
      { status: 500 }
    );
  }
}
const createANewDonation = async ({
  amount,
  donationDesignation,
  fullName,
  phone,
  branch,
  campaignId,
  txRef,
}: {
  amount: string;
  donationDesignation: string;
  fullName: string;
  phone: string;
  branch: string;
  campaignId?: string;
  txRef?: string;
}) => {
  return await createDonation({
    amount,
    donationDesignation,
    fullName,
    phone,
    branch,
    campaignId,
    txRef,
  });
};

const addNewBidder = async ({
  member,
  auction,
}: {
  member: Member;
  auction: Auction;
}) => {
  const bidder = await prisma.bidder.create({
    data: {
      fullName: member.firstName
        ? `${member.firstName} ${member.lastName}`
        : `${member.institutionName}`,
      memberId: member.id,
      offer: 0,
      auctionId: auction.id,
      hasPaidCPO: true,
      hasPaidNRP: true,
    },
  });

  return bidder;
};
