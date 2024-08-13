"use client";

import Footer from "@/landingPage/footer/Footer";
import Naviagtion from "@/landingPage/navigation/Navigation";
import ImageCarousel from "@/landingPage/shared/ImageCarousel";
import { convertYouTubeURL } from "@/util/helper";
import { Skeleton } from "@mui/material";
import { Initiative } from "@prisma/client";
import axios from "axios";
import Image from "next/image";
import { useParams, useRouter } from "next/navigation";
import { useEffect, useState } from "react";

const InitiativeDetail = () => {
  const router = useRouter();
  const params = useParams();
  const [initiative, setInitiative] = useState<Initiative>();
  const [initiativeList, setInitiativeList] = useState<Initiative[]>();
  const [loading, setLoading] = useState(false);

  const fetchInitiative = async () => {
    setLoading(true);
    try {
      const res = await axios.post(`/api/cms/initiative/fetch/${params.id}`);
      if (res.data.success) {
        setInitiative(res.data.value.initiative);
      }
    } catch (err) {
      console.error(err);
    }
    setLoading(false);
  };

  const fetchInitiativeList = async () => {
    try {
      const res = await axios.post(`/api/cms/initiative/fetch`, {
        page: 1,
        pageSize: 4,
      });
      if (res.data.success) {
        setInitiativeList(res.data.value.initiatives);
      }
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    fetchInitiative();
    fetchInitiativeList();
  }, []);

  return (
    <div className=" w-full">
      <Naviagtion />
      <div className="xl:lg:px-40 md:px-20 px-10 w-full mb-32">
        <div className="mt-9 ">
          {loading ? (
            <Skeleton />
          ) : (
            <h2 className="font-extrabold xl:lg:text-4xl text-3xl w-full">
              {initiative?.nameOfInitiative}
            </h2>
          )}
        </div>
        <div className="mt-12 gap-7 font-light min-h-[500px]">
          {loading ? (
            <Skeleton className="min-h-[500px]" />
          ) : (
            <div className=" text-titleColor">
              {initiative?.featuredImages?.[0] && (
                <ImageCarousel images={initiative.featuredImages} />
              )}
              {!initiative?.featuredImages?.[0] && initiative?.youtubeLink && (
                <div className="relative w-full h-fit min-h-[600px]">
                  <iframe
                    width="853"
                    height="480"
                    src={convertYouTubeURL(initiative?.youtubeLink)}
                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                    allowFullScreen
                    title="Embedded youtube"
                    className="absolute w-full left-0 top-0 min-h-full"
                  />
                </div>
              )}
              <p className="mt-6">{initiative?.body}</p>
            </div>
          )}
        </div>
        <div className="mt-20 mb-10">
          <div className="xl:lg:w-1/3 w-fit my-10">
            <span className="font-bold text-center text-3xl">
              Other initiatives
            </span>
            <Image
              draggable={false}
              src={"/images/progress.svg"}
              alt=""
              width={20}
              height={20}
              className="w-full mt-4"
            />
          </div>
          <div className="grid xl:lg:grid-cols-4 md:grid-cols-2 gap-6 w-full">
            {initiativeList?.map((initiative, index) => (
              <div
                onClick={() => router.push(`/initiatives/${initiative.id}`)}
                key={index}
                className="group w-full mt-4 hover:bg-white cursor-pointer"
              >
                <div className="flex flex-col items-center justify-center w-full">
                  <Image
                    draggable={false}
                    height={100}
                    width={100}
                    style={{
                      height: "100%",
                      width: "100%",
                      maxHeight: "300px",
                    }}
                    unoptimized
                    alt=""
                    src={initiative.featuredImages?.[0]}
                  />
                  <p className="group-hover:underline w-full text-start font-bold text-xl my-2">
                    {initiative.nameOfInitiative.length > 60
                      ? `${initiative.nameOfInitiative.slice(0, 60)}...`
                      : initiative.nameOfInitiative}
                  </p>
                  <p className="text-start text-sm w-full text-titleColor">
                    {initiative.body.length > 200
                      ? `${initiative.body.slice(0, 200)}...`
                      : initiative.body}
                  </p>
                  <button className="text-black mt-4 w-full text-left items-start border-none hover:border-none capitalize hover:bg-none bg-none flex flex-row border border-red-500">
                    <span className="font-light">Learn More</span>
                    <Image
                      src={"/images/diagonalarrow.svg"}
                      height={30}
                      width={30}
                      alt=""
                    />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default InitiativeDetail;
