import { useEffect, useState } from "react";
import AuctionCard from "./AuctionCard";
import axios from "axios";
import { useRouter } from "next/navigation";
import { Auction } from "@prisma/client";
import { getFormattedDate } from "@/util/date";

const MemberAuction = () => {
  const router = useRouter();
  const [auctions, setAuctions] = useState<Auction[]>();
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

  useEffect(() => {
    fetchAuctions();
  }, [page]);

  return (
    <div className="flex flex-col gap-6 w-full mt-10">
      {auctions?.map((item, index) => (
        <AuctionCard
          key={index}
          startDate={getFormattedDate(item.startDate)}
          title={item.title}
          description={item.description}
          bidder={64}
          onClick={() => router.push(`/auctions/${item.id}`)}
          endDate={getFormattedDate(item.endDate)}
        />
      ))}
    </div>
  );
};

export default MemberAuction;
