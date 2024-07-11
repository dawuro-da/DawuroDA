"use client";

import Footer from "@/landingPage/footer/Footer";
import Naviagtion from "@/landingPage/navigation/Navigation";
import Image from "next/image";
import { useRouter } from "next/navigation";

const NewsLists = [
  {
    url: "/images/health.svg",
    title: "Health and Hygiene",
    description:
      "Enhancing community well-being by providing access to safe water and improving the quality of health services. This initiative focuses on implementing water sanitation projects and healthcare infrastructure improvements to...",
  },
  {
    url: "/images/forest.svg",
    title: "Forestry Development",
    description:
      "Promoting environmental conservation and sustainable forestry development across all districts of Gamo Zone. This initiative involves implementing measures to protect natural resources, preserve biodiversity, and pro...",
  },
];

const InitiativeDetail = () => {
  const router = useRouter();

  return (
    <div className=" w-full">
      <Naviagtion />
      <div className="xl:lg:px-40 md:px-20 px-10 w-full mb-32">
        <div>
          <h2 className="font-extrabold xl:lg:text-5xl text-3xl mt-9 xl:lg:w-3/4 w-full">
            Tourism Economy Expansion
          </h2>
        </div>
        <div className="gap-7 font-light">
          <div className=" mt-12 text-titleColor">
            <Image
              draggable={false}
              src={"/images/news-image2.svg"}
              alt=""
              width={20}
              height={20}
              className="w-full mb-14 max-h-[800px]"
            />
            <p>
              Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do
              eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut
              enim ad minim veniam, quis nostrud exercitation ullamco laboris
              nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in
              reprehenderit in voluptate velit esse cillum dolore eu fugiat
              nulla pariatur. Excepteur sint occaecat cupidatat non proident,
              sunt in culpa qui officia deserunt mollit anim id est laborum.
              Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do
              eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut
              enim ad minim veniam, quis nostrud exercitation ullamco laboris
              nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in
              reprehenderit in voluptate velit esse cillum dolore eu fugiat
              nulla pariatur. Excepteur sint occaecat cupidatat non proident,
              sunt in culpa qui officia deserunt mollit anim id est laborum
            </p>

            <p>
              Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do
              eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut
              enim ad minim veniam, quis nostrud exercitation ullamco laboris
              nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in
              reprehenderit in voluptate velit esse cillum dolore eu fugiat
              nulla pariatur. Excepteur sint occaecat cupidatat non proident,
              sunt in culpa qui officia deserunt mollit anim id est laborum.
              Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do
              eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut
              enim ad minim veniam, quis nostrud exercitation ullamco laboris
              nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in
              reprehenderit in voluptate velit esse cillum dolore eu fugiat
              nulla pariatur. Excepteur sint occaecat cupidatat non proident,
              sunt in culpa qui officia deserunt mollit anim id est laborum
            </p>

            <p>
              Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do
              eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut
              enim ad minim veniam, quis nostrud exercitation ullamco laboris
              nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in
              reprehenderit in voluptate velit esse cillum dolore eu fugiat
              nulla pariatur. Excepteur sint occaecat cupidatat non proident,
              sunt in culpa qui officia deserunt mollit anim id est laborum
            </p>

            <p>
              Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do
              eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut
              enim ad minim veniam, quis nostrud exercitation ullamco laboris
              nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in
              reprehenderit in voluptate velit esse cillum dolore eu fugiat
              nulla pariatur. Excepteur sint occaecat cupidatat non proident,
              sunt in culpa qui officia deserunt mollit anim id est laborumLorem
              ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod
              tempor incididunt ut labore et dolore magna aliqua. Ut enim ad
              minim veniam, quis nostrud exercitation ullamco laboris nisi ut
              aliquip ex ea commodo consequat. Duis aute irure dolor in
              reprehenderit in voluptate velit esse cillum dolore eu fugiat
              nulla pariatur. Excepteur sint occaecat cupidatat non proident,
              sunt in culpa qui officia deserunt mollit anim id est laborum
            </p>
          </div>
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
            {NewsLists.map((NewsList, id) => (
              <div
                onClick={() => router.push("/initiatives/id")}
                key={id}
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
                    }}
                    alt=""
                    src={NewsList.url}
                  />
                  <p className="group-hover:underline w-full text-start font-bold text-xl my-2">
                    {NewsList.title.length > 60
                      ? `${NewsList.title.slice(0, 60)}...`
                      : NewsList.title}
                  </p>
                  <p className="text-start text-sm w-full text-titleColor">
                    {NewsList.description.length > 200
                      ? `${NewsList.description.slice(0, 200)}...`
                      : NewsList.description}
                  </p>
                  <button className="text-black w-full text-left items-start border-none hover:border-none capitalize hover:bg-none bg-none flex flex-row border border-red-500">
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
