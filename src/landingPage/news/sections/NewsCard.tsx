"use client";
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
    imgSrc: "/images/news1.svg",
  },
  {
    title: "Support Our Mission: Donate Today!",
    date: "Mar 20, 2023",
    imgSrc: "/images/news2.svg",
  },
  {
    title: "Support Our Mission: Donate Today!",
    date: "Mar 20, 2023",
    imgSrc: "/images/news3.svg",
  },
  {
    title: "Devastation in Gaza as Israel wages war on Hamas",
    date: "Mar 20, 2023",
    imgSrc: "/images/news5.svg",
  },
  {
    title: "Support Our Mission: Donate Today!",
    date: "Mar 20, 2023",
    imgSrc: "/images/news6.svg",
  },
];

const NewsCard = () => {
  const router = useRouter();
  return (
    <div className="xl:lg:px-40 md:px-20 px-10 w-full">
      <h2 className="font-bold lg:text-4xl text-lg text-center">News</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 p-4 md:mt-20 mt-8">
        <div
          className="relative lg:col-span-1 lg:block hidden cursor-pointer"
          onClick={() => router.push("/news/news-detail")}
        >
          <Image
            src={newsItems[0].imgSrc}
            alt=""
            width={20}
            height={20}
            className="w-[85%]"
          />
          <div className="absolute bottom-12 text-white left-7 text-left">
            <h2 className="text-2xl font-bold mb-3">{newsItems[0].title}</h2>
            <div className="flex items-center space-x-3">
              <Image
                src="/images/calendar2.svg"
                alt=""
                width={15}
                height={20}
              />
              <p className="text-white font-light text-sm">
                {newsItems[0].date}
              </p>
            </div>
          </div>
        </div>
        <div className="grid grid-cols-1 lg:col-span-1 md:col-span-7 gap-0">
          <div className="relative lg:col-span-1 lg:block hidden mb-5">
            <Image
              src={newsItems[4].imgSrc}
              alt=""
              width={20}
              height={20}
              className="lg:w-full"
            />
            <div className="absolute bottom-12 text-white left-7 text-left">
              <h2 className="text-2xl font-bold mb-3">{newsItems[0].title}</h2>
              <div className="flex items-center space-x-3">
                <Image
                  src="/images/calendar2.svg"
                  alt=""
                  width={15}
                  height={20}
                />
                <p className="text-white font-light text-sm">
                  {newsItems[0].date}
                </p>
              </div>
            </div>
          </div>
          {newsItems?.slice(1, 3).map((item, id) => (
            <div key={id} className="flex flex-col items-start">
              <div className="flex flex-row text-start space-x-6 lg:mb-5 mb-4">
                <Image
                  src={item.imgSrc}
                  alt=""
                  width={20}
                  height={20}
                  className="lg:w-[41%] w-[38%]"
                />
                <div className="mt-2 md:pl-6 pl-0 lg:w-2/4">
                  <h2 className="md:text-xl text-xs font-bold md:mb-1 mb-2 text-[#1E1E1E]">
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
        <div className="flex xl:lg:flex-row md:flex-row flex-col col-span-2 xl:lg:mt-16">
          {newsItems?.slice(1, 3).map((item, id) => (
            <div key={id} className="flex flex-col items-start">
              <div className="flex flex-row text-start space-x-6 lg:mb-5 mb-4">
                <Image
                  src={item.imgSrc}
                  alt=""
                  width={20}
                  height={20}
                  className="lg:w-[41%] w-[38%]"
                />
                <div className="mt-2 md:pl-6 pl-0 lg:w-2/4">
                  <h2 className="md:text-xl text-xs font-bold md:mb-1 mb-2 text-[#1E1E1E]">
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
  );
};

export default NewsCard;
