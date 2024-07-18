"use client";
import Naviagtion from "@/landingPage/navigation/Navigation";
import { Avatar } from "@mui/material";
import Image from "next/image";
import { useRouter } from "next/navigation";
import Footer from "../footer/Footer";

interface NewsItem {
  title: string;
  date: string;
  imgSrc: string;
}

const newsItems: NewsItem[] = [
  {
    title: "Support Our Mission: Donate Today!",
    date: "Mar 20, 2023",
    imgSrc: "/images/newsdetail2.svg",
  },
  {
    title: "Support Our Mission: Donate Today!",
    date: "Mar 20, 2023",
    imgSrc: "/images/eduNews.jpg",
  },
  {
    title: "Support Our Mission: Donate Today!",
    date: "Mar 20, 2023",
    imgSrc: "/images/newsdetail4.svg",
  },
];

const NewsLists = [
  {
    url: "/images/forest.svg",
    title: "Gamo Development Association Launches Major Forestry Initiative ",
    description:
      "The Gamo Development Association (GDA) is proud to announce the launch of a comprehensive forestry initiative aimed at promoting environmental sustainability and economic growth across the Gamo Zone. This landmark project, set to commence in July 2024, will focus on reforestation, sustainable land management, and community education.",
    lastUpdate: "4h ago",
  },
  {
    url: "/images/newslist2.svg",
    title: "Gamo Development Association Announces New Educational Program",
    description:
      "The Gamo Development Association (GDA) is proud to announce the launch of a comprehensive forestry initiative aimed at promoting environmental sustainability and economic growth across the Gamo Zone. This landmark project, set to commence in July 2024, will focus on reforestation, sustainable land management, and community education.",
    lastUpdate: "4d Ago",
  },
];

const NewsDetail = () => {
  const router = useRouter();
  return (
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
          <p>Back to News</p>
        </div>
        <div>
          <h2 className="font-extrabold xl:lg:text-5xl text-3xl mt-9 xl:lg:w-3/4 w-full">
            Elon Musk drops lawsuit after OpenAI published his emails
          </h2>
          <div className="flex flex-row mt-5 space-x-3">
            <Image
              draggable={false}
              src="/images/calendar.svg"
              alt=""
              width={15}
              height={20}
            />
            <p className="text-[#1E1E1E] font-light text-sm">Mar 20,2023</p>
          </div>
        </div>
        <div className="grid xl:lg:grid-cols-4 gap-7 font-light">
          <div className="xl:lg:col-span-3 mt-12 text-titleColor">
            <Image
              draggable={false}
              src={"/images/eduNews.jpg"}
              alt=""
              unoptimized
              width={20}
              height={20}
              className="w-full mb-14"
            />
            <p>
              It is reported that the Gamo Bayra Model boarding school is
              working to become a competitor in the country. Gamo Bayra Model
              boarding school is working with determination to be a competitor
              and competitor in the country, the administrator of the school Mr.
              Ayalew Abera said that the Gamo Development Association is working
              hard to become a competitor. In addition to teaching Gamo Bayra
              Model boarding school, they have also stated that they are
              preparing to score good results in the technology innovation
              competition that is being held in Turkey. The headmaster of the
              school Mr. Abraham Dobe on his behalf; Gamo Bayra Model boarding
              school is ready to receive 150 new students in the 2017 academic
              year. Aklew said that the teaching process is going well than
              ever. The students of the school also expressed that they are well
              prepared for the 2016 academic year secondary school final exam.
              The report was taken from Gamo TV social media page.
            </p>
          </div>

          <div className="xl:lg:block hidden xl:lg:col-span-1">
            <div className="w-full mb-2">
              <span className="font-normal text-sm">More News</span>
              <Image
                draggable={false}
                src={"/images/progress.svg"}
                alt=""
                width={20}
                height={20}
                className="w-full mt-2"
              />
            </div>
            <div className="mt-10">
              {newsItems?.map((item, id) => (
                <div key={id} className="flex flex-col items-start mt-4">
                  <div className="flex flex-row text-start space-x-6 lg:mb-1 mb-4">
                    <Image
                      draggable={false}
                      src={item.imgSrc}
                      alt=""
                      unoptimized
                      width={20}
                      height={20}
                      className="lg:min-w-[40%] min-w-[38%]"
                    />
                    <div className="mt-2 pl-0 w-full">
                      <h2 className="md:text-sm text-xs font-bold md:mb-1 mb-2 text-[#1E1E1E]">
                        {item.title}
                      </h2>
                      <div className="flex flex-row items-center gap-2">
                        <Image
                          draggable={false}
                          src="/images/calendar.svg"
                          alt=""
                          width={15}
                          height={20}
                        />
                        <span className="text-[#1E1E1E] font-light text-[12px]">
                          {item.date}
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
              You May Also Like
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
            {NewsLists.map((NewsList, id) => (
              <div key={id} className="w-full mt-4">
                <div className="flex flex-col items-center justify-center w-full">
                  <Image
                    draggable={false}
                    height={100}
                    width={100}
                    style={{
                      height: "100%",
                      width: "100%",
                    }}
                    alt=""
                    src={NewsList.url}
                  />
                  <p className="text-start w-full text-titleColor">
                    {NewsList.lastUpdate}
                  </p>
                  <p className="w-full text-start font-bold text-xl my-2">
                    {NewsList.title.length > 60
                      ? `${NewsList.title.slice(0, 60)}...`
                      : NewsList.title}
                  </p>
                  <p className="text-start text-sm w-full text-titleColor">
                    {NewsList.description.length > 200
                      ? `${NewsList.description.slice(0, 200)}...`
                      : NewsList.description}
                  </p>
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

export default NewsDetail;
