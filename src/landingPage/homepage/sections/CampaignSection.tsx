import { getFormattedDate } from "@/util/date";
import { Button, Skeleton } from "@mui/material";
import { Campaign } from "@prisma/client";
import axios from "axios";
import Image from "next/image";
import { useEffect, useState } from "react";

const CampaignSection = () => {
  const [campaigns, setCampaigns] = useState<Campaign[]>();
  const [loading, setLoading] = useState(false);

  const fetchCampaigns = async () => {
    setLoading(true);
    try {
      const res = await axios.post("/api/cms/campaign/fetch", {
        page: 1,
        pageSize: 4,
      });
      if (res.data.success) {
        const latestCampaigns = res.data.value.campaigns;
        setCampaigns(latestCampaigns);
      }
    } catch (err) {
      console.log(err);
    }
    setLoading(false);
  };

  useEffect(() => {
    fetchCampaigns();
  }, []);

  return (
    <div className="xl:lg:px-40 md:px-20 px-10 w-full py-12 mt-20 mb-20">
      <div className="grid xl:lg:grid-cols-2 gap-6">
        <div className="w-full h-full flex flex-col justify-center gap-6">
          <span className="tracking-tighter text-3xl font-bold max-w-[400px]">
            Join the Campaign: Support Those in Need, Rebuild Lives
          </span>
          <span className="max-w-[400px]">
            Together, We Can Provide Urgent Relief and Restore Hope to
            Communities in Crisis
          </span>
        </div>
        {loading ? (
          <Skeleton className="min-h-[500px]" />
        ) : (
          <div className="grid lg:grid-cols-2 md:grid-cols-3 gap-6">
            {campaigns?.map((campaign, index) => {
              return (
                <div
                  key={index}
                  style={{ boxShadow: "1px 1px 10px rgb(0,0,0,0.06)" }}
                  className="h-fit flex flex-col justify-center p-6 xl:lg:max-w-[300px] md:max-w-[300px] sm:max-w-[300px] max-w-full rounded-lg gap-4"
                >
                  <Image
                    src={"/icons/supportIcon.svg"}
                    alt=""
                    height={40}
                    width={40}
                  />
                  <span className="font-bold text-lg capitalize">
                    {campaign.headline}
                  </span>
                  <span className="font-light">
                    {getFormattedDate(campaign.startDate)}
                    {` - `}
                    {getFormattedDate(campaign.endDate)}
                  </span>
                  <Button
                    onClick={() =>
                      window.open(
                        "https://chapa.link/donation/view/DN-hCHqr7IQf80T"
                      )
                    }
                    variant="outlined"
                    className="bg-[#13A6D9] border-2 hover:border-2 border-[#13A6D9] hover:border-[#13A6D9] hover:bg-white hover:text-[#13A6D9] text-white font-normal capitalize px-10 py-2 w-fit"
                  >
                    Support
                  </Button>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
};

export default CampaignSection;
