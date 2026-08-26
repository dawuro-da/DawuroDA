"use client";

import DonationForm from "@/landingPage/modals/DonationForm";
import { BarChart, ThumbUp, Add } from "@mui/icons-material";
import { Skeleton } from "@mui/material";
import { Campaign } from "@prisma/client";
import axios from "axios";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";

const TopCampaignSection = () => {
  const { i18n, t } = useTranslation();
  const router = useRouter();
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
        pageSize: 3,
      });
      if (res.data.success) {
        setCampaigns(res.data.value.campaigns);
      }
    } catch (err) {
      console.error(err);
    }
    setLoading(false);
  };

  useEffect(() => {
    fetchCampaigns();
  }, []);

  const openDonate = (campaign: Campaign) => {
    setDesignation({ title: campaign.headline, description: campaign.description });
    setOpenDonationModal(true);
  };

  if (!loading && !campaigns?.length) return null;

  return (
    <div className="xl:lg:px-40 md:px-20 px-10 py-16 w-full pt-24">
      <DonationForm
        open={openDonationModal}
        handleClose={() => setOpenDonationModal(false)}
        designation={designation}
      />
      <div className="text-center mb-12">
        <h2 className="font-bold lg:text-4xl text-2xl mb-3">
          {t("home.campaign_heading")}
        </h2>
        <span className="inline-block w-12 h-1 bg-primaryColor mb-4" />
        <p className="text-titleColor font-light max-w-xl mx-auto">
          {t("home.campaign_subheading")}
        </p>
      </div>
      <div className="grid md:grid-cols-3 grid-cols-1 gap-8">
        {loading
          ? [1, 2, 3].map((item) => (
              <Skeleton key={item} className="min-h-[380px] rounded-2xl" />
            ))
          : campaigns?.map((campaign) => {
              const hasGoal = Boolean(campaign.goalAmount);
              const percent = hasGoal
                ? Math.min(
                    100,
                    Math.round(
                      ((campaign.raisedAmount ?? 0) /
                        (campaign.goalAmount ?? 1)) *
                        100
                    )
                  )
                : null;

              return (
                <div
                  key={campaign.id}
                  className="bg-white rounded-2xl border border-dashed border-gray-200 overflow-hidden"
                >
                  <div className="relative w-full h-[220px]">
                    <Image
                      src={campaign.image ?? "/images/donationBG.webp"}
                      alt=""
                      fill
                      className="object-cover"
                    />
                    <button
                      onClick={() => openDonate(campaign)}
                      className="absolute top-3 right-3 flex items-center gap-1 bg-primaryColor/90 hover:bg-primaryColor text-white text-xs font-semibold px-3 py-1.5 rounded-full transition-colors"
                    >
                      {t("home.donate")}
                      <Add fontSize="inherit" />
                    </button>
                    {percent !== null && (
                      <>
                        <div className="absolute bottom-0 left-0 right-0 h-1.5 bg-white/30">
                          <div
                            className="h-full bg-primaryColor"
                            style={{ width: `${percent}%` }}
                          />
                        </div>
                        <div
                          className="absolute -bottom-4 h-9 w-9 rounded-full bg-primaryColor text-white flex items-center justify-center text-[11px] font-bold border-[3px] border-white shadow-md"
                          style={{ left: `calc(${percent}% - 18px)` }}
                        >
                          {percent}%
                        </div>
                      </>
                    )}
                  </div>
                  <div className="p-6 pt-9">
                    <h3 className="font-bold text-lg mb-2 line-clamp-2">
                      {isAmharic ? campaign.headlineAmharic : campaign.headline}
                    </h3>
                    <p className="text-titleColor text-sm mb-4 line-clamp-2">
                      {campaign.description}
                    </p>
                    {hasGoal && (
                      <div className="flex flex-wrap items-center gap-x-4 gap-y-1 text-titleColor text-sm mb-4">
                        <span className="flex items-center gap-1.5">
                          <BarChart fontSize="small" className="text-primaryColor" />
                          {t("home.goal")}: {campaign.goalAmount?.toLocaleString()}{" "}
                          {t("auctions.auction_detail_page.birr")}
                        </span>
                        <span className="flex items-center gap-1.5">
                          <ThumbUp fontSize="small" className="text-primaryColor" />
                          {t("home.raised")}:{" "}
                          {(campaign.raisedAmount ?? 0).toLocaleString()}{" "}
                          {t("auctions.auction_detail_page.birr")}
                        </span>
                      </div>
                    )}
                  </div>
                </div>
              );
            })}
      </div>
    </div>
  );
};

export default TopCampaignSection;
