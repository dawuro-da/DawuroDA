"use client";

import { useState } from "react";
import { AuctionCardData } from "./AuctionData";
import AuctionCard from "./AuctionCard";

enum Tab {
  PaymentHistoryTab,
  AuctionTab,
}
const HistoryAndAuction = () => {
  const [selectedTab, setSelectedTab] = useState(Tab.PaymentHistoryTab);

  return (
    <div className="max-w-[1000px] text-[14px] mt-10">
      <div className="flex flex-row items-center gap-6 w-full relative">
        <div className="border-b-[1px] w-full absolute bottom-0 z-0" />
        <span
          onClick={() => {
            setSelectedTab(Tab.PaymentHistoryTab);
          }}
          className={`border-b-[2px] ${
            Tab.PaymentHistoryTab === selectedTab
              ? "border-b-primaryColor"
              : "border-b-transparent"
          } pb-1 z-10 cursor-pointer min-w-[80px] text-center`}
        >
          Payment History
        </span>
        <span
          onClick={() => {
            setSelectedTab(Tab.AuctionTab);
          }}
          className={`border-b-[2px] ${
            Tab.AuctionTab === selectedTab
              ? "border-b-primaryColor"
              : "border-b-transparent"
          } pb-1 z-10 cursor-pointer min-w-[80px] text-center`}
        >
          Auction
        </span>
      </div>
      {Tab.PaymentHistoryTab === selectedTab && (
        <div className="flex flex-col gap-6 w-full mt-10">
          {[1, 2, 3, 4].map((item) => {
            return (
              <div className="w-full bg-white border-[1px] flex flex-row items-center justify-between p-4 xl:lg:px-10">
                <span>340ETB</span>
                <span>Quarterly</span>
                <span>May 20,2022</span>
              </div>
            );
          })}
        </div>
      )}
      {Tab.AuctionTab === selectedTab && (
        <div className="flex flex-col gap-6 w-full mt-10">
          {AuctionCardData.map((item, id) => (
            <AuctionCard
              key={id}
              startDate={item.startDate}
              title={item.title}
              description={item.description}
              bidder={item.bidder}
              endDate={item.endDate}
            />
          ))}
        </div>
      )}
    </div>
  );
};

export default HistoryAndAuction;
