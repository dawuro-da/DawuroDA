"use client";
import { Button, CircularProgress } from "@mui/material";
import { News } from "@prisma/client";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { useTranslation } from "react-i18next";

const GridNews = ({
  news,
  loadMore,
  loadingMore,
  hasMore,
}: {
  news: News[];
  loadMore: () => void;
  loadingMore: boolean;
  hasMore: boolean;
}) => {
  const router = useRouter();
  const { i18n, t } = useTranslation();
  const isAmharic = Boolean(i18n.language === "am");

  return (
    <div>
      <div className="xl:lg:px-40 md:px-20 px-10 lg:mt-10 my-6 mb-32">
        <div className="pb-10 grid xl:lg:grid-cols-4 md:grid-cols-2 gap-10">
          {news?.map((newsItem, id) => (
            <div
              onClick={() => router.push(`/news/${newsItem.id}`)}
              key={id}
              className="group w-full cursor-pointer"
            >
              <div className="flex flex-col items-center justify-center gap-1">
                <Image
                  height={100}
                  width={100}
                  style={{ height: "100%", width: "100%" }}
                  src={newsItem.profileImage?.[0]}
                  objectFit="cover"
                  alt=""
                  unoptimized
                />
                <p className="w-[100%] text-start font-bold text-xl group-hover:underline">
                  {isAmharic
                    ? newsItem.headlineAmharic.slice(0, 70)
                    : newsItem.headline.slice(0, 70)}
                  {newsItem.headline.length > 70 && "..."}
                </p>
                <p className="text-[#000000] text-start text-sm w-[100%]">
                  {isAmharic
                    ? newsItem.bodyAmharic.slice(0, 200)
                    : newsItem.body.slice(0, 200)}
                  {newsItem.body.length > 200 && "..."}
                </p>
                <div className="flex flex-row w-full mt-6 items-center justify-start cursor-pointer">
                  <Button
                    variant="outlined"
                    className="text-black border-none hover:border-none capitalize hover:bg-none bg-none flex flex-row"
                  >
                    <span className="font-light">{t('news.learn_more')}</span>
                    <Image
                      src={"/images/diagonalarrow.svg"}
                      height={30}
                      width={30}
                      alt=""
                    />
                  </Button>
                </div>
              </div>
            </div>
          ))}
        </div>
        {hasMore && (
          <div
            onClick={loadMore}
            className="cursor-pointer px-10 border border-[#1E1E1E] w-fit font-light mx-auto h-[50px] flex flex-row items-center justify-center"
          >
            {loadingMore ? <CircularProgress className="h-full" /> : t('news.load_more')}
          </div>
        )}
      </div>
    </div>
  );
};

export default GridNews;
