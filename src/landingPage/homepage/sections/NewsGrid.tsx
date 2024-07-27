import { getFormattedDate } from "@/util/date";
import { Skeleton } from "@mui/material";
import { News } from "@prisma/client";
import axios from "axios";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

const NewsGrid = () => {
  const router = useRouter();
  const [news, setNews] = useState<News[]>();
  const [loading, setLoading] = useState(false);

  const fetchNews = async () => {
    setLoading(true);
    try {
      const res = await axios.post("/api/cms/news/fetch", {
        page: 1,
        pageSize: 7,
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

  return loading ? (
    <Skeleton className="min-h-[500px] w-full" />
  ) : (
    <div className="grid grid-cols-1 md:grid-cols-7 gap-6 p-4 md:mt-20 mt-8 w-4/5 mx-auto">
      <div
        onClick={() => router.push(`/news/${news?.[0]?.id}`)}
        className="group relative lg:col-span-2 lg:block hidden cursor-pointer"
        style={{
          background: `url('${news?.[0]?.profileImage?.[0]}')`,
          backgroundSize: "cover",
          backgroundPosition: "center",
        }}
      >
        <div className="absolute bottom-0 text-white left-0 pb-6 pl-4 pt-3 text-left bg-gradient-to-t from-black to-transparent">
          <h2 className="group-hover:underline text-2xl font-bold mb-3">
            {news?.[0]?.headline && news?.[0]?.headline.length > 60
              ? `${news?.[0].headline.slice(0, 60)}...`
              : news?.[0].headline}
          </h2>
          <div className="flex items-center space-x-3">
            <Image
              src="/images/calendar2.svg"
              alt=""
              unoptimized
              width={15}
              height={20}
            />
            <p className="text-white font-light text-sm">
              {news?.[0].updated_at && getFormattedDate(news?.[0].updated_at)}
            </p>
          </div>
        </div>
      </div>
      <div className="grid grid-cols-1 lg:col-span-3 md:col-span-7 gap-0">
        {news?.slice(1, 4).map((item, id) => (
          <div
            onClick={() => router.push(`/news/${item.id}`)}
            key={id}
            className="group flex flex-col items-start cursor-pointer"
          >
            <div className="flex flex-row text-start space-x-6 lg:mb-1 mb-4 ">
              <Image
                src={item.profileImage?.[0]}
                alt=""
                width={20}
                unoptimized
                height={20}
                className="lg:w-[31%] w-[38%]"
              />
              <div className="mt-2 md:pl-6 pl-0 lg:w-2/4">
                <h2 className="group-hover:underline md:text-xl text-xs font-bold md:mb-1 mb-2 text-[#1E1E1E]">
                  {item.headline.length > 60
                    ? `${item.headline.slice(0, 60)}...`
                    : item.headline}
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
      <div
        onClick={() => router.push(`/news/${news?.[4]?.id}`)}
        className="group cursor-pointer md:col-span-2 md:row-span-2 lg:block hidden"
      >
        <Image
          src={news?.[4]?.profileImage?.[0] ?? ""}
          unoptimized
          alt=""
          width={200}
          height={100}
        />
        <div className="mt-6 w-4/5 text-left">
          <h2 className="group-hover:underline text-xl font-bold mb-1 text-[#1E1E1E]">
            {news?.[4]?.headline && news?.[4]?.headline.length > 60
              ? `${news?.[4]?.headline.slice(0, 60)}...`
              : news?.[4]?.headline}
          </h2>
          <div className="flex items-center space-x-3">
            <Image src="/images/calendar.svg" alt="" width={15} height={20} />
            <p className="text-[#1E1E1E] font-light">
              {news?.[4]?.updated_at && getFormattedDate(news?.[4]?.updated_at)}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default NewsGrid;
