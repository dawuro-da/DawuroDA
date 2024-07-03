import Naviagtion from "@/landingPage/navigation/Navigation";
import AuctionCard from "./AuctionCard";
import { AuctionCardData } from "./AuctionData";

const AuctionSection = () => {
  return (
    <div className="bg-[#F5F5F5] min-h-screen flex flex-col">
      <div className="z-40 absolute top-0 w-full">
        <Naviagtion bg="bg-[#F5F5F5]" />
      </div>
      <div className="w-4/5 mx-auto">
        <div className="text-center lg:mt-[180px] mt-[100px] mb-16">
          <h1 className="lg:text-4xl md:text-2xl text-lg font-extrabold mb-6">
            Auctions
          </h1>
          <p className="font-light text-[#7C7C7C]">Get involved in auctions</p>
        </div>
        <div>
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
      </div>
    </div>
  );
};

export default AuctionSection;
