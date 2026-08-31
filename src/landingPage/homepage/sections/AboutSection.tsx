"use client";

import BoardMemberProfile from "@/landingPage/about/sections/contents/BoardMemberProfile";
import DonationForm from "@/landingPage/modals/DonationForm";
import { ChevronLeft, ChevronRight } from "@mui/icons-material";
import { Button, Skeleton } from "@mui/material";
import { Management } from "@prisma/client";
import axios from "axios";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import Slider from "react-slick";

const AboutSection = () => {
  const router = useRouter();
  const { i18n, t } = useTranslation();
  const isAmharic = Boolean(i18n.language === "am");
  const [openDonateModal, setOpenDonateModal] = useState(false);
  const [openProfileModal, setOpenProfileModal] = useState(false);
  const [selectedManager, setSelectedManager] = useState<Management>();
  const [managers, setManagers] = useState<Management[]>();
  const [loading, setLoading] = useState(false);

  const fetchManagers = async () => {
    setLoading(true);
    try {
      const res = await axios.post("/api/cms/management/fetch", {
        page: 1,
        pageSize: 20,
      });
      if (res.data.success) {
        const latestManagers = res.data.value.managements;
        setManagers(latestManagers);
      }
    } catch (err) {
      console.error(err);
    }
    setLoading(false);
  };

  useEffect(() => {
    fetchManagers();
  }, []);

  // Two slides on large screens (this carousel sits in one half of a
  // 2-column grid, so even at desktop widths its own width is only
  // ~500-600px — the card's internal spacing below is tuned to still fit a
  // manager's name/title cleanly at that width) and one slide once the
  // screen gets too narrow for two cards side by side to be legible.
  const settings = {
    dots: false,
    infinite: true,
    speed: 500,
    slidesToShow: 2,
    slidesToScroll: 1,
    nextArrow: <RightArrow />,
    prevArrow: <LeftArrow />,
    responsive: [
      {
        breakpoint: 700,
        settings: { slidesToShow: 1 },
      },
    ],
  };

  const handleShowProfile = (manager: Management) => {
    setSelectedManager(manager);
    setOpenProfileModal(true);
  };

  return (
    <div className="xl:lg:px-40 md:px-20 px-10 py-24 grid items-center h-fit lg:grid-cols-2 grid-cols-1 gap-12 w-full">
      <DonationForm
        open={openDonateModal}
        handleClose={() => setOpenDonateModal(false)}
      />
      {selectedManager && (
        <BoardMemberProfile
          open={openProfileModal}
          handleClose={() => {
            setOpenProfileModal(false);
            setSelectedManager(undefined);
          }}
          manager={selectedManager}
        />
      )}
      <div className="lg:text-left text-center w-full">
        <span className="inline-block bg-primaryColor/10 text-primaryColor font-semibold text-xs uppercase tracking-wide px-4 py-1.5 rounded-full mb-5">
          {t("home.about")}
        </span>
        <h2 className="font-bold lg:text-4xl text-2xl mb-5">
          {t("home.about_heading")}
        </h2>
        <p className="text-titleColor font-light mb-8 lg:max-w-[85%]">
          {t("home.about_highlight")}
        </p>
        <div className="flex space-x-4 lg:justify-start justify-center">
          <Button
            onClick={() => router.push("/about")}
            variant="outlined"
            className="px-7 py-2.5 rounded capitalize border-2 border-primaryColor bg-primaryColor text-white hover:bg-white hover:text-primaryColor"
          >
            {t("home.about_us")}
          </Button>
          <Button
            onClick={() => setOpenDonateModal(true)}
            variant="outlined"
            className="px-7 py-2.5 rounded capitalize border-2 border-primaryColor text-primaryColor bg-white hover:bg-primaryColor hover:text-white"
          >
            {t("home.donate_button")}
          </Button>
        </div>
      </div>
      <div className="w-full h-full flex items-center">
        <div className="max-w-full w-full max-h-full">
          <Slider {...settings}>
            {loading
              ? [1, 2].map((item) => (
                  <Skeleton
                    key={item}
                    className="w-full min-h-[220px] rounded-2xl"
                  />
                ))
              : managers?.map((manager) => (
                  <div key={manager.id} className="px-2.5">
                    <div
                      onClick={() => handleShowProfile(manager)}
                      className="group cursor-pointer bg-white rounded-2xl shadow-[0_8px_24px_rgba(0,0,0,0.06)] p-4 flex flex-row items-center gap-3 hover:shadow-[0_12px_32px_rgba(0,0,0,0.1)] transition-shadow"
                    >
                      <div className="relative h-14 w-14 shrink-0 rounded-xl overflow-hidden">
                        <Image
                          src={manager.photo}
                          alt=""
                          fill
                          className="object-cover transition-transform duration-500 group-hover:scale-110"
                        />
                      </div>
                      <div className="text-left min-w-0 flex-1">
                        <p className="font-bold text-sm line-clamp-2">
                          {isAmharic
                            ? manager.managerNameAmharic
                            : manager.managerName}
                        </p>
                        <p className="text-primaryColor text-xs font-medium line-clamp-1">
                          {isAmharic ? manager.jobAmharic : manager.job}
                        </p>
                      </div>
                    </div>
                  </div>
                ))}
          </Slider>
        </div>
      </div>
    </div>
  );
};

export default AboutSection;

const RightArrow = (props: any) => {
  const { className, style, onClick } = props;
  return (
    <div
      onClick={onClick}
      style={style}
      className={`${className} before:hidden !h-9 !w-9 rounded-full bg-white shadow-md flex flex-row items-center justify-center !right-0 z-10`}
    >
      <ChevronRight className="text-primaryColor" fontSize="small" />
    </div>
  );
};

const LeftArrow = (props: any) => {
  const { className, style, onClick } = props;
  return (
    <div
      onClick={onClick}
      style={style}
      className={`${className} before:hidden !h-9 !w-9 rounded-full bg-white shadow-md flex flex-row items-center justify-center !left-0 z-10`}
    >
      <ChevronLeft className="text-primaryColor" fontSize="small" />
    </div>
  );
};
