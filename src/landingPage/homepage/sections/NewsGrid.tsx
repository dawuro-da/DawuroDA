import { getFormattedDate } from "@/util/date";
import { Skeleton } from "@mui/material";
import { CalendarMonth, ArrowForward } from "@mui/icons-material";
import { News } from "@prisma/client";
import axios from "axios";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";

const truncate = (text: string, length: number) =>
  text.length > length ? `${text.slice(0, length).trim()}…` : text;

const NewsGrid = () => {
  const router = useRouter();
  const [news, setNews] = useState<News[]>();
  const [loading, setLoading] = useState(false);
  const { t, i18n } = useTranslation();
  const isAmharic = Boolean(i18n.language === "am");

  const fetchNews = async () => {
    setLoading(true);
    try {
      const res = await axios.post("/api/cms/news/fetch", {
        page: 1,
        pageSize: 5,
      });
      if (res.data.success) {
        const latestNews = res.data.value.newss;
        setNews(latestNews);
      }
    } catch (err) {
      console.error(err);
    }
    setLoading(false);
  };

  useEffect(() => {
    fetchNews();
  }, []);

  if (loading) {
    return (
      <div className="w-full xl:lg:px-40 md:px-20 px-10 grid grid-cols-1 md:grid-cols-3 gap-6">
        <Skeleton className="md:col-span-2 min-h-[360px]" />
        <div className="flex flex-col gap-6">
          <Skeleton className="min-h-[170px]" />
          <Skeleton className="min-h-[170px]" />
        </div>
      </div>
    );
  }

  if (!news?.length) return null;

  const [featured, ...rest] = news;

  return (
    <div className="w-full xl:lg:px-40 md:px-20 px-10 grid grid-cols-1 md:grid-cols-3 gap-6">
      <div
        onClick={() => router.push(`/news/${featured.id}`)}
        className="group relative md:col-span-2 min-h-[360px] rounded-2xl overflow-hidden cursor-pointer"
      >
        <Image
          src={featured.profileImage?.[0] ?? "/images/news1.svg"}
          alt=""
          fill
          className="object-cover transition-transform duration-500 group-hover:scale-105"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/10 to-transparent" />
        <div className="absolute bottom-0 left-0 right-0 p-6 text-white">
          <span className="inline-flex items-center gap-1.5 bg-primaryColor text-xs font-semibold px-3 py-1 rounded-full mb-3">
            <CalendarMonth fontSize="inherit" />
            {getFormattedDate(featured.updated_at)}
          </span>
          <h2 className="group-hover:underline text-xl md:text-2xl font-bold leading-snug">
            {truncate(
              isAmharic ? featured.headlineAmharic : featured.headline,
              90
            )}
          </h2>
        </div>
      </div>

      <div className="flex flex-col gap-6">
        {rest.slice(0, 2).map((item) => (
          <div
            key={item.id}
            onClick={() => router.push(`/news/${item.id}`)}
            className="group flex flex-row gap-4 bg-white rounded-2xl shadow-[0_4px_16px_rgba(0,0,0,0.06)] p-3 cursor-pointer hover:shadow-[0_8px_24px_rgba(0,0,0,0.1)] transition-shadow"
          >
            <div className="relative w-24 h-24 shrink-0 rounded-xl overflow-hidden">
              <Image
                src={item.profileImage?.[0] ?? "/images/news2.svg"}
                alt=""
                fill
                className="object-cover"
              />
            </div>
            <div className="flex flex-col justify-center py-1">
              <span className="flex items-center gap-1.5 text-titleColor text-xs mb-1.5">
                <CalendarMonth fontSize="inherit" />
                {getFormattedDate(item.updated_at)}
              </span>
              <h3 className="group-hover:text-primaryColor text-sm font-bold leading-snug">
                {truncate(isAmharic ? item.headlineAmharic : item.headline, 70)}
              </h3>
            </div>
          </div>
        ))}
        <button
          onClick={() => router.push("/news")}
          className="group flex items-center justify-center gap-2 text-primaryColor font-semibold text-sm py-3 rounded-2xl border-2 border-dashed border-primaryColor/40 hover:border-primaryColor hover:bg-primaryColor/5 transition-colors"
        >
          {t("home.news")}
          <ArrowForward
            fontSize="small"
            className="transition-transform group-hover:translate-x-1"
          />
        </button>
      </div>

      {rest.slice(2, 4).map((item) => (
        <div
          key={item.id}
          onClick={() => router.push(`/news/${item.id}`)}
          className="group bg-white rounded-2xl shadow-[0_4px_16px_rgba(0,0,0,0.06)] overflow-hidden cursor-pointer hover:shadow-[0_8px_24px_rgba(0,0,0,0.1)] transition-shadow"
        >
          <div className="relative w-full h-44">
            <Image
              src={item.profileImage?.[0] ?? "/images/news4.svg"}
              alt=""
              fill
              className="object-cover transition-transform duration-500 group-hover:scale-105"
            />
          </div>
          <div className="p-5">
            <span className="flex items-center gap-1.5 text-titleColor text-xs mb-2">
              <CalendarMonth fontSize="inherit" />
              {getFormattedDate(item.updated_at)}
            </span>
            <h3 className="group-hover:text-primaryColor text-base font-bold leading-snug">
              {truncate(isAmharic ? item.headlineAmharic : item.headline, 70)}
            </h3>
          </div>
        </div>
      ))}
    </div>
  );
};

export default NewsGrid;
