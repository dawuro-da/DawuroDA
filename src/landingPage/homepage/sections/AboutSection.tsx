"use client";

import BoardMemberProfile from "@/landingPage/about/sections/contents/BoardMemberProfile";
import DonationForm from "@/landingPage/modals/DonationForm";
import useLanguageStore from "@/redux/languageStore";
import { Avatar, Button, Skeleton } from "@mui/material";
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
  const [isSmallScreen, setIsSmallScreen] = useState(false);
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
    if (window.innerWidth < 700) {
      setIsSmallScreen(true);
    } else {
      setIsSmallScreen(false);
    }
  }, []);

  const settings = {
    dots: true,
    infinite: true,
    speed: 500,
    slidesToShow: isSmallScreen ? 2 : 3,
    slidesToScroll: 1,
    nextArrow: <RightArrow />,
    prevArrow: <LeftArrow />,
  };

  const handleShowProfile = (manager: Management) => {
    setSelectedManager(manager);
    setOpenProfileModal(true);
  };

  return (
    <div className="xl:lg:px-40 md:px-20 px-10 grid items-center h-fit lg:grid-cols-2 grid-cols-1 mt-32 mb-32 w-full">
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
      <div className="lg:text-left text-center  w-full">
        <h6 className="text-[#000000] text-sm mb-7 font-light">
          {t("home.about")}
        </h6>
        <h2 className="font-bold lg:text-4xl text-lg mb-7">
          {t("home.about_heading")}
        </h2>
        <p className="text-[#6A6A6A] font-light mb-7 lg:max-w-[70%]">
          {t("home.about_highlight")}
        </p>
        <div className="flex space-x-5 lg:justify-start justify-center">
          <Button
            onClick={() => router.push("/about")}
            variant="outlined"
            className="px-7 hover:bg-[#ffffff] border-2 border-[#292929] hover:border-2 hover:border-[#292929] py-2 rounded-md text-white hover:text-[#222222] bg-[#222222]"
          >
            {t("home.about_us")}
          </Button>
          <Button
            onClick={() => setOpenDonateModal(true)}
            variant="outlined"
            className="px-7 hover:bg-[#292929] border-2 border-[#292929] hover:border-2 hover:border-[#292929] py-2 rounded-md text-[#292929] hover:text-[#ffffff] bg-[#ffffff]"
          >
            {t("home.donate_button")}
          </Button>
        </div>
      </div>
      <div className=" mt-10 lg:mt-0 w-full h-full flex items-center">
        <div className="max-w-full w-full max-h-full">
          <Slider {...settings}>
            {loading
              ? [1, 2, 3].map((item) => (
                  <Skeleton key={item} className="w-full min-h-[100px]" />
                ))
              : managers?.map((manager, index) => (
                  <div
                    key={manager.id}
                    className="px-2 w-full h-fit"
                    onClick={() => handleShowProfile(manager)}
                  >
                    <div className="text-center flex flex-col items-center justify-center gap-1">
                      <Avatar
                        style={{ height: 85, width: 85 }}
                        alt=""
                        src={manager.photo}
                      />
                      <p className="font-bold text-base ">
                        {isAmharic
                          ? manager.managerNameAmharic.slice(0, 30)
                          : manager.managerName.slice(0, 30)}
                      </p>
                      <p className="text-[#000000] text-sm">
                        {isAmharic
                          ? manager.jobAmharic.slice(0, 30)
                          : manager.job.slice(0, 30)}
                      </p>
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
      className={`${className} rounded-full bg-white flex flex-row items-center justify-center`}
    >
      <Image
        src={"/images/arrowdown.svg"}
        className="-rotate-90 opacity-55"
        alt=""
        height={20}
        width={20}
      />
    </div>
  );
};

const LeftArrow = (props: any) => {
  const { className, style, onClick } = props;
  return (
    <div
      onClick={onClick}
      style={style}
      className={`${className} rounded-full bg-white flex flex-row items-center justify-center`}
    >
      <Image
        src={"/images/arrowdown.svg"}
        className="rotate-90 opacity-55"
        alt=""
        height={20}
        width={20}
      />
    </div>
  );
};
