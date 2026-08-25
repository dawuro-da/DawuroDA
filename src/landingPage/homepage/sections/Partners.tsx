import DonationForm from "@/landingPage/modals/DonationForm";
import { Button, Skeleton } from "@mui/material";
import { Partnership } from "@prisma/client";
import axios from "axios";
import Image from "next/image";
import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import Slider from "react-slick";

const Partners = () => {
  const { t } = useTranslation();
  const [isSmallScreen, setIsSmallScreen] = useState(false);
  const [openDonateModal, setOpenDonateModal] = useState(false);
  const [partnerships, setPartnerships] = useState<Partnership[]>();
  const [loading, setLoading] = useState(false);

  const fetchPartnerships = async () => {
    setLoading(true);
    try {
      const res = await axios.post("/api/cms/partnership/fetch", {
        page: 1,
        pageSize: 20,
      });
      if (res.data.success) {
        const latestPartnerships = res.data.value.partnerships;
        setPartnerships(latestPartnerships);
      }
    } catch (err) {
      console.error(err);
    }
    setLoading(false);
  };

  useEffect(() => {
    fetchPartnerships();
    if (window.innerWidth < 700) {
      setIsSmallScreen(true);
    } else {
      setIsSmallScreen(false);
    }
  }, []);

  const settings = {
    dots: false,
    arrows: false,
    infinite: true,
    autoplay: true,
    autoplaySpeed: 500,
    cssEase: "linear",
    speed: 2000,
    slidesToScroll: 1,
    slidesToShow: isSmallScreen
      ? 3
      : partnerships && partnerships?.length < 6
      ? partnerships?.length
      : 6,
  };

  return (
    <div id="donate" className="lg:py-24 py-16">
      <DonationForm
        open={openDonateModal}
        handleClose={() => setOpenDonateModal(false)}
      />
      <h2 className="font-bold lg:text-4xl md:text-2xl text-xl mb-10 text-center">
        {t("home.partners")}
      </h2>
      <div className="xl:lg:px-40 md:px-20 max-w-full w-screen flex flex-row items-center justify-center">
        <div className="w-full overflow-y-hidden overflow-x-auto hiddenscrollbar">
          <Slider {...settings} className="">
            {loading
              ? [1, 2, 3].map((item) => (
                  <Skeleton key={item} className="w-full" />
                ))
              : partnerships?.map((item, id) => (
                  <div
                    key={id}
                    className="w-[80px] h-[80px] flex flex-row items-center justify-center"
                  >
                    <Image
                      src={`${item.logo}`}
                      height={80}
                      width={80}
                      unoptimized
                      alt=""
                      key={id}
                    />
                  </div>
                ))}
          </Slider>
        </div>
      </div>

    </div>
  );
};

export default Partners;
