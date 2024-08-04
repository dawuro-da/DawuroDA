import { getServerSession } from "next-auth";
import AuctionSection from "./sections/AuctionSection";
import { OPTIONS } from "@/util/authOptions";
import { Bidder, UserRole } from "@prisma/client";
import prisma from "@/lib/prisma";

const AuctionPage = async () => {
  const session = await getServerSession(OPTIONS);
  let bidders: Bidder[] | null = null;
  if (session?.user.id && session.user.role === UserRole.Member) {
    bidders = await prisma.bidder.findMany({
      where: { memberId: session.user.id },
    });
  }

  return (
    <>
      <AuctionSection bidders={bidders} />
    </>
  );
};

export default AuctionPage;
