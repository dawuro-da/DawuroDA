"use client";

import Naviagtion from "@/landingPage/navigation/Navigation";
import AuctionCard from "./AuctionCard";
import Footer from "@/landingPage/footer/Footer";
import { useEffect, useState } from "react";
import axios from "axios";
import { Auction, Bidder } from "@prisma/client";
import { CircularProgress, Skeleton } from "@mui/material";
import { getFormattedDate } from "@/util/date";
import { useRouter } from "next/navigation";
import { I18nextProvider, useTranslation } from "react-i18next";
import useLanguageStore from "@/redux/languageStore";
import i18n from "../../../../i18n";

const AuctionSection = ({ bidders }: { bidders: Bidder[] | null }) => {
  const router = useRouter();
  const [auctions, setAuctions] = useState<
    (Auction & {
      totalBidders: number;
      totalCPO: number;
      totalDocumentSales: number;
    })[]
  >();
  const [total, setTotal] = useState(0);
  const [loading, setLoading] = useState(false);
  const [loadingMore, setLoadingMore] = useState(false);
  const [page, setPage] = useState(1);
  const { i18n: i18nn, t } = useTranslation();
  const { language } = useLanguageStore();

  useEffect(() => {
    i18nn.changeLanguage(language);
  }, [language, i18nn]);

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
        setTotal(res.data.value.total);
      }
    } catch (err) {
      console.error(err);
    }
    setLoading(false);
    setLoadingMore(false);
  };

  useEffect(() => {
    fetchAuctions();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [page]);

  const hasMore = Boolean(auctions && auctions.length < total);

  return (
    <I18nextProvider i18n={i18n}>
      <div className="bg-[#F5F5F5] min-h-screen flex flex-col">
        <div className="z-40 absolute top-0 w-full">
          <Naviagtion bg="bg-[#F5F5F5]" />
        </div>
        <div className="xl:lg:px-40 md:px-20 px-10 w-full">
          <div className="text-center lg:mt-[180px] mt-[100px] mb-16">
            <h1 className="lg:text-4xl md:text-2xl text-lg font-extrabold mb-6">
              {t("auctions.auctions_heading")}
            </h1>
            <p className="font-light text-[#7C7C7C]">
              {t("auctions.auctions_subheading")}
            </p>
          </div>
          <div className="min-h-[200px]">
            {loading ? (
              <>
                <Skeleton style={{ width: "100%", height: "200px" }} />
                <Skeleton style={{ width: "100%", height: "200px" }} />
              </>
            ) : !auctions?.length ? (
              <div className="w-full text-center text-[#7C7C7C] min-h-[200px] flex items-center justify-center">
                <span>Currently, there are no auctions available.</span>
              </div>
            ) : (
              auctions.map((item, index) => {
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
                    t={t}
                  />
                );
              })
            )}
          </div>
          {hasMore && (
            <div className="w-full my-20">
              <div
                onClick={() => setPage(page + 1)}
                className="cursor-pointer px-10 border border-[#1E1E1E] w-fit font-light mx-auto h-[50px] flex flex-row items-center justify-center"
              >
                {loadingMore ? (
                  <CircularProgress className="h-full" />
                ) : (
                  t("auctions.load_more")
                )}
              </div>
            </div>
          )}
        </div>
        <Footer />
      </div>
    </I18nextProvider>
  );
};

export default AuctionSection;
