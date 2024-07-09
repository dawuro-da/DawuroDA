"use client";
import { Avatar, Button } from "@mui/material";
import Image from "next/image";
import { useEffect, useState } from "react";
import Slider from "react-slick";

const GridNews = () => {
  const [screenSize, setScreenSize] = useState<number>();
  const news = [
    {
      url: "/images/health.svg",
      title: "Health and Hygiene ",
      description:
        "Enhancing community well-being by providing access to safe water and improving the quality of health services. This initiative focuses on implementing water sanitation projects and healthcare infrastructure improvements to...",
    },
    {
      url: "/images/tourism.svg",
      title: "Tourism Economy Expansion",
      description:
        "Boosting the economy of the community by upgrading, modernizing, and expanding tourism destinations. This initiative focuses on enhancing visitor experiences, promoting local attractions, and supporting tourism-related...",
    },
    {
      url: "/images/forest.svg",
      title: "Forestry Development",
      description:
        "Promoting environmental conservation and sustainable forestry development across all districts of Gamo Zone. This initiative involves implementing measures to protect natural resources, preserve biodiversity, and pro...",
    },
  ];

  return (
    <div>
      <div className="xl:lg:px-40 md:px-20 px-10 lg:mt-10 my-6 mb-32">
        <div className="pb-10 flex md:flex-row flex-col gap-10">
          {news.map((Initiative, id) => (
            <div key={id} className="group w-full cursor-pointer">
              <div className="flex flex-col items-center justify-center gap-1">
                <Avatar
                  style={{ height: "100%", width: "100%", borderRadius: "0px" }}
                  alt=""
                  src={Initiative.url}
                />
                <p className="w-[100%] text-start font-bold text-xl group-hover:underline">
                  {Initiative.title}
                </p>
                <p className="text-[#000000] text-start text-sm w-[100%]">
                  {Initiative.description}
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
        <div className="px-4 py-1 border border-[#1E1E1E] w-fit font-light mx-auto">
          Load More
        </div>
      </div>
    </div>
  );
};

export default GridNews;
