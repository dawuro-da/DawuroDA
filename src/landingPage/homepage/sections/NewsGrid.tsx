import { getFormattedDate } from "@/util/date";
import { Skeleton } from "@mui/material";
import { CalendarMonth } from "@mui/icons-material";
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
  const { i18n } = useTranslation();
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
      <div className="w-full xl:lg:px-40 md:px-20 px-10 grid grid-cols-1 md:grid-cols-2 gap-6">
        <Skeleton className="min-h-[500px] rounded-2xl" />
        <div className="flex flex-col gap-6">
          <Skeleton className="min-h-[230px] rounded-2xl" />
          <Skeleton className="min-h-[112px] rounded-2xl" />
          <Skeleton className="min-h-[112px] rounded-2xl" />
        </div>
      </div>
    );
  }

  if (!news?.length) return null;

  const featured = news[0];
  const secondaryFeatured = news[4];
  const listItems = news.slice(1, 3);

  const OverlayCard = ({
    item,
    minHeightClass,
    titleClass,
  }: {
    item: News;
    minHeightClass: string;
    titleClass: string;
  }) => (
    <div
      onClick={() => router.push(`/news/${item.id}`)}
      className={`group relative rounded-2xl overflow-hidden cursor-pointer ${minHeightClass}`}
    >
      <Image
        src={item.profileImage?.[0] ?? "/images/news1.svg"}
        alt=""
        fill
        className="object-cover transition-transform duration-500 group-hover:scale-105"
      />
      <div className="absolute bottom-0 left-0 right-0 text-white pt-16 pb-6 px-6 bg-gradient-to-t from-black to-transparent">
        <h2
          className={`group-hover:underline font-bold leading-snug mb-2 ${titleClass}`}
        >
          {truncate(isAmharic ? item.headlineAmharic : item.headline, 90)}
        </h2>
        <span className="flex items-center gap-1.5 font-light text-sm">
          <CalendarMonth fontSize="small" />
          {getFormattedDate(item.updated_at)}
        </span>
      </div>
    </div>
  );

  return (
    <div className="w-full xl:lg:px-40 md:px-20 px-10 grid grid-cols-1 md:grid-cols-2 gap-6">
      <OverlayCard
        item={featured}
        minHeightClass="min-h-[500px]"
        titleClass="text-xl md:text-2xl"
      />

      <div className="grid grid-cols-1 gap-6">
        {secondaryFeatured && (
          <OverlayCard
            item={secondaryFeatured}
            minHeightClass="min-h-[230px]"
            titleClass="text-xl md:text-2xl"
          />
        )}
        {listItems.map((item) => (
          <div
            key={item.id}
            onClick={() => router.push(`/news/${item.id}`)}
            className="group flex flex-row gap-4 cursor-pointer"
          >
            <div className="relative w-28 h-28 shrink-0 rounded-xl overflow-hidden">
              <Image
                src={item.profileImage?.[0] ?? "/images/news2.svg"}
                alt=""
                fill
                className="object-cover"
              />
            </div>
            <div className="flex flex-col justify-center py-1">
              <h3 className="group-hover:text-primaryColor text-base font-bold leading-snug mb-2">
                {truncate(isAmharic ? item.headlineAmharic : item.headline, 70)}
              </h3>
              <span className="flex items-center gap-1.5 text-titleColor text-xs">
                <CalendarMonth fontSize="inherit" />
                {getFormattedDate(item.updated_at)}
              </span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default NewsGrid;
