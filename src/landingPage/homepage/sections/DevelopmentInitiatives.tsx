import { CalendarMonth, ArrowOutward } from "@mui/icons-material";
import { Skeleton } from "@mui/material";
import { Initiative } from "@prisma/client";
import { getFormattedDate } from "@/util/date";
import axios from "axios";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";

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
        pageSize: 3,
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

  return (
    <div id="initiatives" className="bg-[#F7F7F7] py-16">
      <span className="block text-primaryColor font-semibold text-sm uppercase tracking-wide text-center mb-2">
        {t("navigation.initiatives")}
      </span>
      <h1 className="text-[#1E1E1E] font-bold lg:text-4xl text-lg mb-1 text-center">
        {t("home.development_initiatives_heading")}
      </h1>
      <p className="text-titleColor font-light md:max-w-[30%] max-w-[80%] mx-auto text-center">
        {t("home.development_initiatives_subheading")}
      </p>
      <div className="xl:lg:px-40 md:px-20 px-10 mx-auto lg:mt-20 mt-12 flex flex-col gap-6">
        {loading
          ? [1, 2, 3].map((item) => (
              <Skeleton key={item} className="w-full min-h-[220px] rounded-2xl" />
            ))
          : initiatives?.map((initiative) => (
              <div
                key={initiative.id}
                onClick={() => router.push(`/initiatives/${initiative.id}`)}
                className="group cursor-pointer bg-white rounded-2xl border border-dashed border-gray-200 overflow-hidden flex flex-col md:flex-row hover:shadow-[0_12px_32px_rgba(0,0,0,0.08)] transition-shadow"
              >
                <div className="relative w-full md:w-[280px] h-[220px] md:h-auto shrink-0 overflow-hidden">
                  <Image
                    src={initiative.featuredImages?.[0] ?? "/images/tourism.svg"}
                    alt=""
                    fill
                    className="object-cover transition-transform duration-500 group-hover:scale-105"
                  />
                </div>
                <div className="p-6 md:p-8 flex flex-col justify-center">
                  <h3 className="group-hover:text-primaryColor font-bold text-xl mb-3">
                    {!isAmharic
                      ? initiative.nameOfInitiative
                      : initiative.nameOfInitiativeAmharic}
                  </h3>
                  <span className="flex items-center gap-1.5 text-titleColor text-sm mb-3">
                    <CalendarMonth fontSize="small" />
                    {getFormattedDate(initiative.created_at)}
                  </span>
                  <p className="text-titleColor text-sm mb-5 line-clamp-2">
                    {!isAmharic ? initiative.body : initiative.bodyAmharic}
                  </p>
                  <span className="inline-flex items-center gap-1.5 w-fit text-primaryColor font-semibold text-sm px-5 py-2 rounded border-2 border-primaryColor group-hover:bg-primaryColor group-hover:text-white transition-colors">
                    {t("home.learn_more")}
                    <ArrowOutward fontSize="small" />
                  </span>
                </div>
              </div>
            ))}
      </div>
    </div>
  );
};

export default DevelopmentInitiatives;
