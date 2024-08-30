import DonationForm from "@/landingPage/modals/DonationForm";
import { getFormattedDate } from "@/util/date";
import { Button, Skeleton } from "@mui/material";
import { Campaign } from "@prisma/client";
import axios from "axios";
import Image from "next/image";
import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";

const CampaignSection = () => {
  const { i18n, t } = useTranslation();
  const isAmharic = Boolean(i18n.language === "am");
  const [campaigns, setCampaigns] = useState<Campaign[]>();
  const [loading, setLoading] = useState(false);
  const [openDonationModal, setOpenDonationModal] = useState(false);
  const [designation, setDesignation] = useState<{
    title: string;
    description: string;
  }>();

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
      console.error(err);
    }
    setLoading(false);
  };

  useEffect(() => {
    fetchCampaigns();
  }, []);

  return !loading && campaigns && !(campaigns?.length > 0) ? null : (
    <div className="xl:lg:px-40 md:px-20 px-10 w-full py-10 mt-16 mb-16">
      <DonationForm
        open={openDonationModal}
        handleClose={() => setOpenDonationModal(false)}
        designation={designation}
      />
      <div className="grid xl:lg:grid-cols-2 gap-6">
        <div className="w-full h-full flex flex-col justify-center gap-6">
          <span className="tracking-tighter text-3xl font-bold max-w-[400px]">
            {t("home.campaign_heading")}
          </span>
          <span className="max-w-[400px]">{t("home.campaign_subheading")}</span>
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
                    {isAmharic
                      ? campaign.headlineAmharic.slice(0, 100)
                      : campaign.headline.slice(0, 100)}
                    {campaign.headline.length > 100 && "..."}
                  </span>
                  <span className="font-light">
                    {getFormattedDate(campaign.startDate)}
                    {` - `}
                    {getFormattedDate(campaign.endDate)}
                  </span>
                  <Button
                    onClick={() => {
                      setOpenDonationModal(true);
                      setDesignation({
                        title: campaign.headline,
                        description: campaign.description,
                      });
                    }}
                    variant="outlined"
                    className="bg-[#13A6D9] border-2 hover:border-2 border-[#13A6D9] hover:border-[#13A6D9] hover:bg-white hover:text-[#13A6D9] text-white font-normal capitalize px-10 py-2 w-fit"
                  >
                    {t("home.support")}
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
