"use client";
import Naviagtion from "@/landingPage/navigation/Navigation";
import { Skeleton } from "@mui/material";
import Image from "next/image";
import { useParams, useRouter } from "next/navigation";
import Footer from "../footer/Footer";
import { useEffect, useState } from "react";
import { News } from "@prisma/client";
import axios from "axios";
import { getFormattedDate } from "@/util/date";
import ImageCarousel from "../shared/ImageCarousel";
import { I18nextProvider, useTranslation } from "react-i18next";
import useLanguageStore from "@/redux/languageStore";
import i18n from "../../../i18n";

const NewsDetail = () => {
  const params = useParams();
  const router = useRouter();
  const [news, setNews] = useState<News>();
  const [newsList, setNewsList] = useState<News[]>();
  const [loading, setLoading] = useState(false);
  const { i18n: i18nn, t } = useTranslation();
  const isAmharic = Boolean(i18nn.language === "am");
  const { language } = useLanguageStore();

  useEffect(() => {
    i18nn.changeLanguage(language);
  }, [language, i18nn]);

  const fetchNews = async () => {
    setLoading(true);
    try {
      const res = await axios.post(`/api/cms/news/fetch/${params.id}`);
      if (res.data.success) {
        setNews(res.data.value.news);
      }
    } catch (err) {
      console.warn(err);
    }
    setLoading(false);
  };

  const fetchNewsList = async () => {
    try {
      const res = await axios.post(`/api/cms/news/fetch`, {
        page: 1,
        pageSize: 8,
      });
      if (res.data.success) {
        setNewsList(
          res.data.value.newss.filter((item: any) => item.id !== params?.id)
        );
      }
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    fetchNews();
    fetchNewsList();
  }, []);

  const settings = {
    dots: true,
    infinite: true,
    speed: 500,
    slidesToShow: 1,
    slidesToScroll: 1,
    nextArrow: <RightArrow />,
    prevArrow: <LeftArrow />,
  };

  return (
    <I18nextProvider i18n={i18n}>
      <div className=" w-full">
        <Naviagtion />
        <div className="xl:lg:px-40 md:px-20 px-10 w-full mb-32">
          <div
            className="flex flex-row gap-2 cursor-pointer w-fit text-titleColor"
            onClick={() => router.push("/news")}
          >
            <Image
              draggable={false}
              src={"/images/back.svg"}
              alt=""
              width={20}
              height={20}
            />
            <p>{t("news.back_to_news")}</p>
          </div>
          <div className="grid xl:lg:grid-cols-4 gap-7 font-light">
            <div className="xl:lg:col-span-3 mt-12 ">
              <div className="">
                {loading ? (
                  <Skeleton className="w-full" />
                ) : (
                  <>
                    <h2 className="font-extrabold xl:lg:text-4xl text-3xl w-full">
                      {isAmharic ? news?.headlineAmharic : news?.headline}
                    </h2>

                    <div className="flex flex-row mt-5 space-x-3">
                      <Image
                        draggable={false}
                        src="/images/calendar.svg"
                        alt=""
                        width={15}
                        height={20}
                      />
                      <p className="text-[#1E1E1E] font-light text-sm">
                        {news?.updated_at && getFormattedDate(news.updated_at)}
                      </p>
                    </div>
                  </>
                )}
              </div>
              {loading ? (
                <Skeleton className="w-full min-h-[500px]" />
              ) : (
                <div className="w-full text-titleColor">
                  {news?.profileImage?.[0] && (
                    <ImageCarousel
                      youtubeLink={news?.youtubeLink}
                      images={news.profileImage}
                    />
                  )}

                  <p className="mt-8">
                    {isAmharic ? news?.bodyAmharic : news?.body}
                  </p>
                </div>
              )}
            </div>
            <div className="xl:lg:block hidden xl:lg:col-span-1">
              <div className="w-full mb-2">
                <span className="font-normal text-sm">More News</span>
                <Image
                  draggable={false}
                  src={"/images/progress.svg"}
                  alt=""
                  unoptimized
                  width={20}
                  height={20}
                  className="w-full mt-2 max-h-[200px]"
                />
              </div>
              <div className="mt-10">
                {newsList?.length &&
                  newsList?.slice(0, 3).map((item, index) => (
                    <div
                      onClick={() => router.push(`/news/${item.id}`)}
                      key={index}
                      className="group cursor-pointer flex flex-col items-start mt-4"
                    >
                      <div className="flex flex-row text-start space-x-6 lg:mb-1 mb-4">
                        <Image
                          draggable={false}
                          src={item.profileImage?.[0]}
                          alt=""
                          unoptimized
                          objectFit="cover"
                          width={20}
                          height={20}
                          className="lg:min-w-[40%] min-w-[38%] h-fit max-h-[200px]"
                        />
                        <div className=" pl-0 w-full">
                          <h2 className="group-hover:underline md:text-sm text-xs font-bold md:mb-1 mb-2 text-[#1E1E1E]">
                            {item.headline.length > 60
                              ? `${
                                  isAmharic
                                    ? item.headlineAmharic.slice(0, 60)
                                    : item.headline.slice(0, 60)
                                }...`
                              : isAmharic
                              ? item.headlineAmharic
                              : item.headline}
                          </h2>
                          <div className="flex flex-row items-center gap-2">
                            <Image
                              draggable={false}
                              src="/images/calendar.svg"
                              alt=""
                              unoptimized
                              width={15}
                              height={20}
                            />
                            <span className="text-[#1E1E1E] font-light text-[12px]">
                              {getFormattedDate(item.updated_at)}
                            </span>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
              </div>
            </div>
          </div>
          <div className="my-10">
            <div className="xl:lg:w-1/3 w-fit my-10">
              <span className="font-bold text-center text-3xl">
                {t("news.you_may_also_like")}
              </span>
              <Image
                draggable={false}
                src={"/images/progress.svg"}
                alt=""
                width={20}
                unoptimized
                height={20}
                className="w-full mt-4"
              />
            </div>
            <div className="grid xl:lg:grid-cols-4 md:grid-cols-2 gap-6 w-full">
              {newsList &&
                newsList?.length > 3 &&
                newsList?.slice(3, 7).map((NewsList, id) => (
                  <div
                    onClick={() => router.push(`/news/${NewsList.id}`)}
                    key={id}
                    className="cursor-pointer group w-full mt-4"
                  >
                    <div className="flex flex-col items-center justify-center w-full">
                      <Image
                        draggable={false}
                        height={100}
                        width={100}
                        unoptimized
                        objectFit="cover"
                        style={{
                          height: "100%",
                          width: "100%",
                        }}
                        alt=""
                        src={NewsList.profileImage?.[0]}
                      />
                      <p className="text-start w-full text-titleColor">
                        {getFormattedDate(NewsList.updated_at)}
                      </p>
                      <p className="group-hover:underline cursor-pointer w-full text-start font-bold text-xl my-2">
                        {NewsList.headline.length > 60
                          ? `${
                              isAmharic
                                ? NewsList.headlineAmharic.slice(0, 60)
                                : NewsList.headline.slice(0, 60)
                            }...`
                          : isAmharic
                          ? NewsList.headlineAmharic
                          : NewsList.headline}
                      </p>
                      <p className="text-start text-sm w-full text-titleColor">
                        {NewsList.body.length > 200
                          ? `${
                              isAmharic
                                ? NewsList.bodyAmharic.slice(0, 200)
                                : NewsList.body.slice(0, 200)
                            }...`
                          : isAmharic
                          ? NewsList.bodyAmharic
                          : NewsList.body}
                      </p>
                    </div>
                  </div>
                ))}
            </div>
          </div>
        </div>
        <Footer />
      </div>
    </I18nextProvider>
  );
};

export default NewsDetail;

const RightArrow = (props: any) => {
  const { className, style, onClick } = props;
  return (
    <div
      onClick={onClick}
      style={style}
      className={`${className} rounded-full bg-white flex flex-row items-center justify-center`}
    >
      <Image
        src={"/images/arrowdown.svg"}
        className="-rotate-90 opacity-55"
        alt=""
        height={20}
        width={20}
      />
    </div>
  );
};

const LeftArrow = (props: any) => {
  const { className, style, onClick } = props;
  return (
    <div
      onClick={onClick}
      style={style}
      className={`${className} rounded-full bg-white flex flex-row items-center justify-center`}
    >
      <Image
        src={"/images/arrowdown.svg"}
        className="rotate-90 opacity-55"
        alt=""
        height={20}
        width={20}
      />
    </div>
  );
};
