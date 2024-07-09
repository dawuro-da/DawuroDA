'use client'
import Naviagtion from "@/landingPage/navigation/Navigation";
import { Avatar } from "@mui/material";
import Image from "next/image";
import { useRouter } from "next/navigation";

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
    imgSrc: "/images/newsdetail3.svg",
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
    const router = useRouter()
  return (
    <div className="w-4/5 mx-auto">
      <Naviagtion />
      <div className="flex flex-row gap-2 cursor-pointer w-fit" onClick={() => router.push('/news')}>
        <Image src={"/images/back.svg"} alt="" width={20} height={20} />
        <p>Back to News</p>
      </div>
      <div>
        <h2 className="font-extrabold text-5xl mt-9 w-3/4">
          Elon Musk drops lawsuit after OpenAI published his emails
        </h2>
        <div className="flex flex-row mt-5 space-x-3">
          <Image src="/images/calendar.svg" alt="" width={15} height={20} />
          <p className="text-[#1E1E1E] font-light text-sm">Mar 20,2023</p>
        </div>
      </div>
      <div className="grid grid-cols-4 gap-7 font-light">
        <div className="col-span-3 mt-12">
          <Image
            src={"/images/newsdetail1.svg"}
            alt=""
            width={20}
            height={20}
            className="w-full mb-14"
          />
          <p>
            Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do
            eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim
            ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut
            aliquip ex ea commodo consequat. Duis aute irure dolor in
            reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla
            pariatur. Excepteur sint occaecat cupidatat non proident, sunt in
            culpa qui officia deserunt mollit anim id est laborum. Lorem ipsum
            dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor
            incididunt ut labore et dolore magna aliqua. Ut enim ad minim
            veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex
            ea commodo consequat. Duis aute irure dolor in reprehenderit in
            voluptate velit esse cillum dolore eu fugiat nulla pariatur.
            Excepteur sint occaecat cupidatat non proident, sunt in culpa qui
            officia deserunt mollit anim id est laborum
          </p>
          <br />
          <p>
            Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do
            eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim
            ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut
            aliquip ex ea commodo consequat. Duis aute irure dolor in
            reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla
            pariatur. Excepteur sint occaecat cupidatat non proident, sunt in
            culpa qui officia deserunt mollit anim id est laborum
          </p>
          <br />
          <p>
            Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do
            eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim
            ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut
            aliquip ex ea commodo consequat. Duis aute irure dolor in
            reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla
            pariatur. Excepteur sint occaecat cupidatat non proident, sunt in
            culpa qui officia deserunt mollit anim id est laborumLorem ipsum
            dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor
            incididunt ut labore et dolore magna aliqua. Ut enim ad minim
            veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex
            ea commodo consequat. Duis aute irure dolor in reprehenderit in
            voluptate velit esse cillum dolore eu fugiat nulla pariatur.
            Excepteur sint occaecat cupidatat non proident, sunt in culpa qui
            officia deserunt mollit anim id est laborum
          </p>
          <br />

          <p>
            Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do
            eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim
            ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut
            aliquip ex ea commodo consequat. Duis aute irure dolor in
            reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla
            pariatur. Excepteur sint occaecat cupidatat non proident, sunt in
            culpa qui officia deserunt mollit anim id est laborum. Lorem ipsum
            dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor
            incididunt ut labore et dolore magna aliqua. Ut enim ad minim
            veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex
            ea commodo consequat. Duis aute irure dolor in reprehenderit in
            voluptate velit esse cillum dolore eu fugiat nulla pariatur.
            Excepteur sint occaecat cupidatat non proident, sunt in culpa qui
            officia deserunt mollit anim id est laborum
          </p>
          <br />
          <p>
            Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do
            eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim
            ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut
            aliquip ex ea commodo consequat. Duis aute irure dolor in
            reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla
            pariatur. Excepteur sint occaecat cupidatat non proident, sunt in
            culpa qui officia deserunt mollit anim id est laborum
          </p>
          <br />

          <p>
            Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do
            eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim
            ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut
            aliquip ex ea commodo consequat. Duis aute irure dolor in
            reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla
            pariatur. Excepteur sint occaecat cupidatat non proident, sunt in
            culpa qui officia deserunt mollit anim id est laborumLorem ipsum
            dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor
            incididunt ut labore et dolore magna aliqua. Ut enim ad minim
            veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex
            ea commodo consequat. Duis aute irure dolor in reprehenderit in
            voluptate velit esse cillum dolore eu fugiat nulla pariatur.
            Excepteur sint occaecat cupidatat non proident, sunt in culpa qui
            officia deserunt mollit anim id est laborum
          </p>
          <div className="my-10">
            <div className="w-1/3 my-10">
              <h2 className="font-bold text-center text-3xl mb-2">
                You May Also Like
              </h2>
              <Image
                src={"/images/progress.svg"}
                alt=""
                width={20}
                height={20}
                className="w-full"
              />
            </div>
            <div className="pb-10 col-span-3 flex-row flex w-full">
              {NewsLists.map((NewsList, id) => (
                <div key={id} className="col-span-3 w-full">
                  <div className="flex flex-col items-center justify-center w-full col-span-3">
                    <Avatar
                      style={{
                        height: "100%",
                        width: "85%",
                        borderRadius: "0px",
                      }}
                      alt=""
                      src={NewsList.url}
                    />
                    <p className="text-start my-4 w-[85%]">
                      {NewsList.lastUpdate}
                    </p>
                    <p className="w-[85%] text-start font-bold text-xl my-4">
                      {NewsList.title}
                    </p>
                    <p className="text-[#000000] text-start text-sm w-[85%]">
                      {NewsList.description}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="col-span-1">
          <div className="w-full mb-2">
            <h2 className="font-bold text-base mb-2">More News</h2>
            <Image
              src={"/images/progress.svg"}
              alt=""
              width={20}
              height={20}
              className="w-full"
            />
          </div>
          <div>
            {newsItems?.map((item, id) => (
              <div key={id} className="flex flex-col items-start">
                <div className="flex flex-row text-start space-x-6 lg:mb-1 mb-4">
                  <Image
                    src={item.imgSrc}
                    alt=""
                    width={20}
                    height={20}
                    className="lg:w-[31%] w-[38%]"
                  />
                  <div className="mt-2 md:pl-6 pl-0 lg:w-full">
                    <h2 className="md:text-base text-xs font-bold md:mb-1 mb-2 text-[#1E1E1E]">
                      {item.title}
                    </h2>
                    <div className="flex items-center space-x-3">
                      <Image
                        src="/images/calendar.svg"
                        alt=""
                        width={15}
                        height={20}
                      />
                      <p className="text-[#1E1E1E] font-light lg:text-base text-xs">
                        {item.date}
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default NewsDetail;
