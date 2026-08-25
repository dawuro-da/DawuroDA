import {
  CalendarMonth,
  ArrowForward,
  ChevronLeft,
  ChevronRight,
} from "@mui/icons-material";
import { Skeleton } from "@mui/material";
import { Initiative } from "@prisma/client";
import { getFormattedDate } from "@/util/date";
import axios from "axios";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import Slider from "react-slick";

const HOME_PREVIEW_COUNT = 5;

const DevelopmentInitiatives = () => {
  const router = useRouter();
  const { i18n, t } = useTranslation();
  const isAmharic = Boolean(i18n.language === "am");
  const [initiatives, setInitiatives] = useState<Initiative[]>();
  const [loading, setLoading] = useState(false);

  const fetchInitiatives = async () => {
    setLoading(true);
    try {
      const res = await axios.post("/api/cms/initiative/fetch", {
        page: 1,
        pageSize: HOME_PREVIEW_COUNT,
      });
      if (res.data.success) {
        const latestInitiatives = res.data.value.initiatives;
        setInitiatives(latestInitiatives);
      }
    } catch (err) {
      console.error(err);
    }
    setLoading(false);
  };

  useEffect(() => {
    fetchInitiatives();
  }, []);

  const settings = {
    dots: false,
    infinite: (initiatives?.length ?? 0) > 2,
    speed: 500,
    slidesToScroll: 1,
    slidesToShow: 2,
    nextArrow: <RightArrow />,
    prevArrow: <LeftArrow />,
    responsive: [
      { breakpoint: 900, settings: { slidesToShow: 1 } },
    ],
  };

  return (
    <div id="initiatives" className="bg-[#F7F7F7] py-16">
      <div className="text-center mb-12 xl:lg:px-40 md:px-20 px-10">
        <span className="block text-primaryColor font-semibold text-sm uppercase tracking-wide mb-2">
          {t("navigation.initiatives")}
        </span>
        <h1 className="text-[#1E1E1E] font-bold lg:text-4xl text-lg mb-3">
          {t("home.development_initiatives_heading")}
        </h1>
        <span className="block w-16 h-1 bg-primaryColor mx-auto mb-4" />
        <p className="text-titleColor font-light max-w-xl mx-auto">
          {t("home.development_initiatives_subheading")}
        </p>
      </div>
      <div className="xl:lg:px-40 md:px-20 px-10 mx-auto">
        {loading ? (
          <div className="grid md:grid-cols-2 grid-cols-1 gap-6">
            <Skeleton className="w-full min-h-[280px] rounded-xl" />
            <Skeleton className="w-full min-h-[280px] rounded-xl hidden md:block" />
          </div>
        ) : initiatives?.length ? (
          <Slider {...settings} className="initiatives-slider">
            {initiatives.map((initiative) => (
              <div key={initiative.id} className="px-3">
                <div
                  onClick={() => router.push(`/initiatives/${initiative.id}`)}
                  className="group cursor-pointer bg-white border border-dashed border-gray-200 overflow-hidden flex flex-col md:flex-row hover:shadow-[0_12px_32px_rgba(0,0,0,0.08)] transition-shadow"
                >
                  <div className="relative w-full md:w-[45%] h-[220px] md:h-auto shrink-0 overflow-hidden">
                    <Image
                      src={initiative.featuredImages?.[0] ?? "/images/tourism.svg"}
                      alt=""
                      fill
                      className="object-cover transition-transform duration-500 group-hover:scale-105"
                    />
                  </div>
                  <div className="p-6 md:p-8 flex flex-col justify-center">
                    <h3 className="group-hover:text-primaryColor font-bold text-lg mb-3 line-clamp-2">
                      {!isAmharic
                        ? initiative.nameOfInitiative
                        : initiative.nameOfInitiativeAmharic}
                    </h3>
                    <span className="flex items-center gap-1.5 text-titleColor text-xs uppercase tracking-wide mb-3">
                      <CalendarMonth className="text-primaryColor" fontSize="small" />
                      {getFormattedDate(initiative.created_at)}
                    </span>
                    <p className="text-titleColor text-sm mb-5 line-clamp-2">
                      {!isAmharic ? initiative.body : initiative.bodyAmharic}
                    </p>
                    <button className="w-fit bg-primaryColor text-white font-semibold text-sm px-6 py-2.5 rounded hover:opacity-90 transition-opacity">
                      {t("home.learn_more")}
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </Slider>
        ) : null}
        {!loading && Boolean(initiatives?.length) && (
          <div className="flex justify-center mt-12">
            <button
              onClick={() => router.push("/initiatives")}
              className="group flex items-center gap-2 text-primaryColor font-semibold text-sm hover:text-[#1E1E1E] transition-colors"
            >
              {t("home.see_all")}
              <ArrowForward
                fontSize="small"
                className="transition-transform group-hover:translate-x-1"
              />
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default DevelopmentInitiatives;

const RightArrow = (props: any) => {
  const { className, style, onClick } = props;
  return (
    <div
      onClick={onClick}
      style={{ ...style, background: "#34A858" }}
      className={`${className} before:hidden !h-12 !w-12 !bg-primaryColor !flex !flex-row !items-center !justify-center !p-0 !-right-5 z-10 shadow-md`}
    >
      <ChevronRight className="!text-white" />
    </div>
  );
};

const LeftArrow = (props: any) => {
  const { className, style, onClick } = props;
  return (
    <div
      onClick={onClick}
      style={{ ...style, background: "#34A858" }}
      className={`${className} before:hidden !h-12 !w-12 !bg-primaryColor !flex !flex-row !items-center !justify-center !p-0 !-left-5 z-10 shadow-md`}
    >
      <ChevronLeft className="!text-white" />
    </div>
  );
};
