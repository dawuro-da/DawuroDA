import { getFormattedDate } from "@/util/date";
import { CircularProgress, Skeleton } from "@mui/material";
import { News } from "@prisma/client";
import axios from "axios";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import GridNews from "./GridNews";
import { useTranslation } from "react-i18next";

interface NewsItem {
  title: string;
  date: string;
  imgSrc: string;
}

const NewsCard = () => {
  const router = useRouter();
  const [news, setNews] = useState<News[]>();
  const [total, setTotal] = useState(0);
  const [loading, setLoading] = useState(false);
  const [loadingMore, setLoadingMore] = useState(false);
  const [page, setPage] = useState(1);
  const { i18n, t } = useTranslation();
  const isAmharic = Boolean(i18n.language === "am");

  const fetchNews = async () => {
    page === 1 ? setLoading(true) : setLoadingMore(true);
    try {
      const res = await axios.post("/api/cms/news/fetch", {
        page: page,
        pageSize: 20,
      });
      if (res.data.success) {
        const latestNews = res.data.value.newss;
        const oldNews = news?.length ? news : [];
        setNews([...oldNews, ...latestNews]);
        setTotal(res.data.value.total);
      }
    } catch (err) {
      console.error(err);
    }
    setLoading(false);
    setLoadingMore(false);
  };

  useEffect(() => {
    fetchNews();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [page]);

  const hasMore = Boolean(news && news.length < total);

  return (
    <>
      <div className="xl:lg:px-40 md:px-20 px-10 w-full min-h-[500px]">
        <h2 className="font-bold lg:text-4xl text-lg text-center">
          {t("news.news")}
        </h2>
        {loading ? (
          <div className="grid xl:lg:grid-cols-2 md:grid-cols-2 gap-6 w-full md:mt-20 mt-8">
            <Skeleton className="w-full h-[300px]" />
            <Skeleton className="w-full h-[300px]" />
          </div>
        ) : news && news?.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 p-4 md:mt-20 mt-8 gap-4">
            <div
              className="relative lg:col-span-1 lg:block hidden cursor-pointer group"
              onClick={() => router.push(`/news/${news?.[0].id}`)}
              style={{
                background: `url('${news?.[0]?.profileImage?.[0]}')`,
                backgroundSize: "cover",
                backgroundPosition: "center",
              }}
            >
              <div className="absolute bottom-0 text-white left-0 pb-6 pl-4 pt-3 text-left bg-gradient-to-t from-black to-transparent">
                <span className="text-2xl font-bold group-hover:underline">
                  {isAmharic
                    ? news?.[0]?.headlineAmharic.slice(0, 70)
                    : news?.[0]?.headline.slice(0, 70)}
                  {news?.[0]?.headline.length > 70 && "..."}
                </span>
                <div className="flex items-center space-x-3">
                  <Image
                    src="/images/calendar2.svg"
                    alt=""
                    width={15}
                    height={20}
                  />
                  <p className="text-white font-light text-sm">
                    {news?.[0] && getFormattedDate(news?.[0]?.updated_at)}
                  </p>
                </div>
              </div>
            </div>
            <div className="grid grid-cols-1 lg:col-span-1 md:col-span-7 gap-4">
              {news?.[4] && (
                <div
                  onClick={() => router.push(`/news/${news[4].id}`)}
                  style={{
                    background: `url('${news[4].profileImage?.[0]}')`,
                    backgroundSize: "cover",
                    backgroundPosition: "center",
                  }}
                  className="relative lg:col-span-1 lg:block hidden group cursor-pointer min-h-[300px]"
                >
                  <div className="absolute bottom-0 text-white left-0 pb-6 pl-4 pt-3 text-left bg-gradient-to-t from-black to-transparent cursor-pointer">
                    <h2 className="group-hover:underline text-2xl font-bold mb-3">
                      {isAmharic
                        ? news[4].headlineAmharic.slice(0, 70)
                        : news[4].headline.slice(0, 70)}
                      {news[4].headline.length > 70 && "..."}
                    </h2>
                    <div className="flex items-center space-x-3">
                      <Image
                        src="/images/calendar2.svg"
                        alt=""
                        width={15}
                        height={20}
                      />
                      <p className="text-white font-light text-sm">
                        {getFormattedDate(news[4].updated_at)}
                      </p>
                    </div>
                  </div>
                </div>
              )}
              {news?.slice(1, 3).map((item, id) => (
                <div
                  key={id}
                  className="flex flex-col items-start cursor-pointer group"
                  onClick={() => router.push(`/news/${item.id}`)}
                >
                  <div
                    onClick={() => router.push(`/news/${item.id}`)}
                    className="flex flex-row text-start space-x-6 lg:mb-5 mb-4"
                  >
                    <Image
                      src={item.profileImage?.[0]}
                      alt=""
                      width={20}
                      height={20}
                      unoptimized
                      className="lg:w-[38%] max-h-[200px] w-[38%]"
                    />
                    <div className="mt-2 md:pl-6 pl-0 lg:w-2/4">
                      <h2 className="group-hover:underline md:text-xl text-xs font-bold md:mb-1 mb-2 text-[#1E1E1E]">
                        {isAmharic
                          ? item.headlineAmharic.slice(0, 70)
                          : item.headline.slice(0, 70)}
                        {item.headline.length > 70 && "..."}
                      </h2>
                      <div className="flex items-center space-x-3">
                        <Image
                          src="/images/calendar.svg"
                          alt=""
                          width={15}
                          height={20}
                        />
                        <p className="text-[#1E1E1E] font-light lg:text-base text-xs">
                          {getFormattedDate(item.updated_at)}
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
            <div className="mt-2 flex xl:lg:flex-row md:flex-row flex-col col-span-2 xl:lg:mt-16">
              {news?.slice(3, 6).map((item, index) => (
                <div
                  key={item.id}
                  className="flex flex-col items-start cursor-pointer group w-full"
                  onClick={() => router.push(`/news/${item.id}`)}
                >
                  <div className="flex flex-row text-start space-x-6 lg:mb-5 mb-4">
                    <Image
                      src={item.profileImage?.[0]}
                      alt=""
                      width={20}
                      height={20}
                      unoptimized
                      objectFit="cover"
                      className="lg:w-[41%] w-[38%] h-fit max-h-full"
                    />
                    <div className="mt-2 md:pl-6 pl-0 lg:w-2/4">
                      <h2 className="group-hover:underline md:text-xl text-xs font-bold md:mb-1 mb-2 text-[#1E1E1E]">
                        {isAmharic
                          ? item.headlineAmharic.slice(0, 70)
                          : item.headline.slice(0, 70)}
                        {item.headline.length > 70 && "..."}
                      </h2>
                      <div className="flex items-center space-x-3">
                        <Image
                          src="/images/calendar.svg"
                          alt=""
                          width={15}
                          height={20}
                        />
                        <p className="text-[#1E1E1E] font-light lg:text-base text-xs">
                          {getFormattedDate(item.updated_at)}
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        ) : (
          <div className="w-full mt-12 h-full items-center justify-center text-titleColor min-h-[300px] text-center">
            <span>Currently, There are no news available.</span>
          </div>
        )}
      </div>
      {news && news?.length && (
        <GridNews
          news={news.filter((news, index) => index > 6)}
          loadMore={() => setPage(page + 1)}
          loadingMore={loadingMore}
          hasMore={hasMore}
        />
      )}
    </>
  );
};

export default NewsCard;
