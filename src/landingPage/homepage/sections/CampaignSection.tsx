"use client";

import DonationForm from "@/landingPage/modals/DonationForm";
import { convertYouTubeURL } from "@/util/helper";
import { PlayArrow, Close, BarChart, ThumbUp } from "@mui/icons-material";
import { Button, Modal, Skeleton } from "@mui/material";
import { Campaign } from "@prisma/client";
import axios from "axios";
import Image from "next/image";
import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";

const CampaignSection = () => {
  const { i18n, t } = useTranslation();
  const isAmharic = Boolean(i18n.language === "am");
  const [campaign, setCampaign] = useState<Campaign | null>();
  const [loading, setLoading] = useState(false);
  const [openDonationModal, setOpenDonationModal] = useState(false);
  const [openVideoModal, setOpenVideoModal] = useState(false);

  const fetchFeaturedCampaign = async () => {
    setLoading(true);
    try {
      const res = await axios.post("/api/cms/campaign/fetch/featured");
      if (res.data.success) {
        setCampaign(res.data.value.campaign);
      }
    } catch (err) {
      console.error(err);
    }
    setLoading(false);
  };

  useEffect(() => {
    fetchFeaturedCampaign();
  }, []);

  if (loading) {
    return (
      <div className="w-full">
        <Skeleton className="min-h-[420px]" />
      </div>
    );
  }

  if (!campaign) return null;

  const hasGoal = Boolean(campaign.goalAmount);
  const percent = hasGoal
    ? Math.min(
        100,
        Math.round(
          ((campaign.raisedAmount ?? 0) / (campaign.goalAmount ?? 1)) * 100
        )
      )
    : 0;

  return (
    <div id="campaign" className="w-full">
      <DonationForm
        open={openDonationModal}
        handleClose={() => setOpenDonationModal(false)}
        designation={{
          title: isAmharic ? campaign.headlineAmharic : campaign.headline,
          description: isAmharic
            ? campaign.descriptionAmharic || campaign.description
            : campaign.description,
          campaignId: campaign.id,
        }}
      />
      <Modal open={openVideoModal} onClose={() => setOpenVideoModal(false)}>
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[92vw] max-w-3xl aspect-video bg-black rounded-xl overflow-hidden outline-none">
          <button
            onClick={() => setOpenVideoModal(false)}
            className="absolute top-2 right-2 z-10 bg-white/90 hover:bg-white rounded-full p-1.5"
          >
            <Close fontSize="small" />
          </button>
          {campaign.youtubeLink && (
            <iframe
              className="w-full h-full"
              src={convertYouTubeURL(campaign.youtubeLink)}
              title={campaign.headline}
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
              allowFullScreen
            />
          )}
        </div>
      </Modal>

      <div
        className="relative w-full min-h-[640px] flex items-center"
        style={{
          backgroundImage: `url(/Featured Campaign section Image.png)`,
          backgroundSize: "cover",
          backgroundPosition: "center",
        }}
      >
        <div className="absolute inset-0 bg-black/30" />
        <div className="relative z-10 grid md:grid-cols-2 gap-10 items-center p-8 md:p-14 xl:lg:px-40 md:px-20 w-full">
          <div className="text-white">
            <span className="inline-block bg-primaryColor text-xs font-semibold uppercase tracking-wide px-4 py-1.5 rounded-full mb-5">
              {t("home.featured_campaign")}
            </span>
            <h2 className="text-2xl md:text-4xl font-bold mb-4 leading-snug">
              {isAmharic ? campaign.headlineAmharic : campaign.headline}
            </h2>
            <p className="text-white/80 mb-6 max-w-lg">
              {isAmharic
                ? campaign.descriptionAmharic || campaign.description
                : campaign.description}
            </p>

            {hasGoal && (
              <>
                <div className="relative w-full h-2 bg-white/20 rounded-full mb-8 mt-10">
                  <div
                    className="absolute inset-y-0 left-0 bg-primaryColor rounded-full"
                    style={{ width: `${percent}%` }}
                  />
                  <div
                    className="absolute -top-3 h-8 w-8 rounded-full bg-primaryColor border-4 border-white text-white text-[10px] font-bold flex items-center justify-center"
                    style={{
                      left: `clamp(0px, calc(${percent}% - 16px), calc(100% - 32px))`,
                    }}
                  >
                    {percent}%
                  </div>
                </div>
                <div className="flex flex-wrap items-center gap-x-6 gap-y-2 mb-8 text-white">
                  <span className="flex items-center gap-2 font-semibold">
                    <BarChart className="text-primaryColor" />
                    {t("home.goal")}: {campaign.goalAmount?.toLocaleString()}{" "}
                    {t("auctions.auction_detail_page.birr")}
                  </span>
                  <span className="flex items-center gap-2 font-semibold">
                    <ThumbUp className="text-primaryColor" />
                    {t("home.raised")}:{" "}
                    {(campaign.raisedAmount ?? 0).toLocaleString()}{" "}
                    {t("auctions.auction_detail_page.birr")}
                  </span>
                </div>
              </>
            )}

            <Button
              onClick={() => setOpenDonationModal(true)}
              variant="outlined"
              className="bg-primaryColor border-2 border-primaryColor hover:bg-white hover:text-primaryColor text-white font-bold capitalize px-8 py-2.5 rounded"
            >
              {t("home.donate")}
            </Button>
          </div>

          <div className="relative w-full h-[260px] md:h-[320px] rounded-xl overflow-hidden">
            <Image
              src={campaign.image ?? "/images/donationBG.webp"}
              alt=""
              fill
              className="object-cover"
            />
            {campaign.youtubeLink && (
              <button
                onClick={() => setOpenVideoModal(true)}
                className="absolute inset-0 flex items-center justify-center group"
              >
                <span className="h-16 w-16 rounded-full bg-white/90 group-hover:bg-white flex items-center justify-center transition-colors">
                  <PlayArrow className="text-primaryColor" fontSize="large" />
                </span>
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default CampaignSection;
