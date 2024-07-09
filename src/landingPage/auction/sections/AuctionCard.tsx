export interface AuctionCardItems {
  startDate: string;
  title: string;
  description: string;
  bidder: number;
  endDate: string;
}

const AuctionCard = ({
  startDate,
  title,
  description,
  bidder,
  endDate,
}: AuctionCardItems) => {
  return (
    <div className="bg-[#FFFFFF] mb-9 lg:md:px-10 px-4 py-8 w-full">
      <h6 className="text-xs font-light">
        Start Date: <span className="font-medium">{startDate}</span>
      </h6>
      <h1 className="text-xl text-[#7C7C7C] font-bold my-5">{title}</h1>
      <p className="font-light text-sm mb-5">{description}</p>
      <div className="flex flex-row gap-4 text-xs">
        <div>
          <span className="font-light">Bidders:</span> {bidder}
        </div>
        <div>
          <span className="font-light">End Date:</span>
          {endDate}
        </div>
      </div>
      <div className="flex justify-end">
        <button className="text-white capitalize bg-[#34a858] font-light shadow-none px-6 py-2 rounded-[5px] cursor-pointer lg:md:mt-0 mt-6">
          Apply
        </button>
      </div>
    </div>
  );
};

export default AuctionCard;
