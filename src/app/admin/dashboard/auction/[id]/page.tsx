import AuctionDetail from "@/components/auctions/AuctionDetail";
import { findAuctionById } from "@/db/auction";

const AuctionDetailPage = async ({ params }: { params: { id: string } }) => {
  const auction = await findAuctionById(params.id);
  return <AuctionDetail auction={auction} />;
};

export default AuctionDetailPage;
