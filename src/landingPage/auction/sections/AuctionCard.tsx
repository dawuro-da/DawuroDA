import { Button } from "@mui/material";

export interface AuctionCardItems {
  startDate: string;
  title: string;
  description: string;
  bidder: number;
  endDate: string;
  onClick: () => void;
  isApplied: boolean;
  isInProgress: boolean;
  t: any;
}

const AuctionCard = ({
  startDate,
  title,
  description,
  bidder,
  isApplied,
  isInProgress,
  endDate,
  onClick,
  t,
}: AuctionCardItems) => {
  return (
    <div className="bg-[#FFFFFF] mb-9 lg:md:px-10 px-4 py-8 w-full">
      <h6 className="text-xs font-light">
        {t("auctions.start_date")}:{" "}
        <span className="font-medium">{startDate}</span>
      </h6>
      <h1 className="text-xl text-[#7C7C7C] font-bold my-5">{title}</h1>
      <p className="font-light text-sm mb-5">{description}</p>
      <div className="flex flex-row gap-4 text-xs">
        <div>
          <span className="font-light">{t("auctions.bidders")}:</span> {bidder}
        </div>
        <div>
          <span className="font-light">{t("auctions.end_date")}:</span>
          {endDate}
        </div>
      </div>
      <div className="flex justify-end">
        <Button
          onClick={onClick}
          variant="contained"
          disabled={isApplied}
          className={` capitalize ${
            isInProgress
              ? "bg-[#eeee0d] hover:bg-[#eeee0d] text-black font-bold"
              : "bg-[#34a858] text-white"
          } shadow-none px-6 py-2 rounded-[5px] cursor-pointer lg:md:mt-0 mt-6`}
        >
          {isApplied
            ? t("auctions.applied")
            : isInProgress
            ? t("auctions.in_progress_button")
            : t("auctions.apply_button")}
        </Button>
      </div>
    </div>
  );
};

export default AuctionCard;
