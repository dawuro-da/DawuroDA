import AuctionDetail from "@/landingPage/auction/auctionDetail/AuctionDetail";
import prisma from "@/lib/prisma";
import { OPTIONS } from "@/util/authOptions";
import { getServerSession } from "next-auth";
import { redirect } from "next/navigation";

export default async function AuctionDetailPage({
  params,
}: {
  params: {
    id: string;
  };
}) {
  const session = await getServerSession(OPTIONS);
  if (!session?.user?.id) {
    redirect("/login");
  }

  const auction = await prisma.auction.findUnique({ where: { id: params.id } });
  if (!auction) {
    redirect("/auctions");
  }

  const bidder = await prisma.bidder.findFirst({
    where: {
      memberId: session.user.id,
      auctionId: auction.id,
    },
  });

  return (
    <AuctionDetail auction={auction} bidder={bidder} member={session.user} />
  );
}
