import { useEffect, useState } from "react";
import AuctionCard from "./AuctionCard";
import axios from "axios";
import { useRouter } from "next/navigation";
import { Auction, Bidder } from "@prisma/client";
import { getFormattedDate } from "@/util/date";
import { CircularProgress, Skeleton } from "@mui/material";

const MemberAuction = () => {
  const router = useRouter();
  const [auctions, setAuctions] = useState<
    (Auction & {
      totalBidders: number;
      totalCPO: number;
      totalDocumentSales: number;
    })[]
  >();
  const [bidders, setBidders] = useState<Bidder[]>();
  const [loading, setLoading] = useState(false);
  const [loadingMore, setLoadingMore] = useState(false);
  const [page, setPage] = useState(1);

  const fetchAuctions = async () => {
    page === 1 ? setLoading(true) : setLoadingMore(true);
    try {
      const res = await axios.post("/api/auction/fetch", {
        page: page,
        pageSize: 10,
      });
      if (res.data.success) {
        const latestAuctions = res.data.value.auctions;
        const oldAuctions = auctions?.length ? auctions : [];
        setAuctions([...oldAuctions, ...latestAuctions]);
      }
    } catch (err) {
      console.error(err);
    }
    setLoading(false);
    setLoadingMore(false);
  };

  const fetchUserBids = async () => {
    try {
      const res = await axios.post("/api/auction/userBids");
      if (res.data.success) {
        setBidders(res.data.value);
      }
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    fetchAuctions();
    fetchUserBids();
  }, [page]);

  return (
    <div className="flex flex-col gap-6 w-full mt-10">
      {loading ? (
        <>
          <Skeleton style={{ width: "100%", height: "200px" }} />
          <Skeleton style={{ width: "100%", height: "200px" }} />
        </>
      ) : (
        auctions?.map((item, index) => {
          const bidder = bidders?.filter(
            (bidder) => bidder.auctionId === item.id
          );
          const isApplied = Boolean(bidder?.[0]?.isSubmitted);
          const isInProgress = Boolean(
            bidder?.[0]?.hasPaidCPO || bidder?.[0]?.hasPaidNRP
          );

          return (
            <AuctionCard
              key={index}
              startDate={getFormattedDate(item.startDate)}
              title={item.title}
              description={item.description}
              bidder={item.totalBidders}
              isApplied={isApplied}
              isInProgress={isInProgress}
              onClick={() => router.push(`/auctions/${item.id}`)}
              endDate={getFormattedDate(item.endDate)}
            />
          );
        })
      )}
      <div className="w-full my-20">
        <div
          onClick={() => setPage(page + 1)}
          className="cursor-pointer px-10 border border-[#1E1E1E] w-fit font-light mx-auto h-[50px] flex flex-row items-center justify-center"
        >
          {loadingMore ? <CircularProgress className="h-full" /> : "Load More"}
        </div>
      </div>
    </div>
  );
};

export default MemberAuction;
