"use client";
import { Button, CircularProgress } from "@mui/material";
import { News } from "@prisma/client";
import Image from "next/image";
import { useRouter } from "next/navigation";

const GridNews = ({
  news,
  loadMore,
  loadingMore,
}: {
  news: News[];
  loadMore: () => void;
  loadingMore: boolean;
}) => {
  const router = useRouter();

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
                  alt=""
                  unoptimized
                />
                <p className="w-[100%] text-start font-bold text-xl group-hover:underline">
                  {newsItem.headline}
                </p>
                <p className="text-[#000000] text-start text-sm w-[100%]">
                  {newsItem.body.slice(0, 200)}
                  {newsItem.body.length > 200 && "..."}
                </p>
                <div className="flex flex-row w-full mt-6 items-center justify-start cursor-pointer">
                  <Button
                    variant="outlined"
                    className="text-black border-none hover:border-none capitalize hover:bg-none bg-none flex flex-row"
                  >
                    <span className="font-light">Learn More</span>
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
        <div
          onClick={loadMore}
          className="cursor-pointer px-10 border border-[#1E1E1E] w-fit font-light mx-auto h-[50px] flex flex-row items-center justify-center"
        >
          {loadingMore ? <CircularProgress className="h-full" /> : "Load More"}
        </div>
      </div>
    </div>
  );
};

export default GridNews;
