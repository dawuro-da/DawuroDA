import Image from "next/image";
import { useRouter } from "next/navigation";

interface NewsItem {
  title: string;
  date: string;
  imgSrc: string;
}

const newsItems: NewsItem[] = [
  {
    title: "Gamo Bayra Model boarding school",
    date: "Mar 20, 2023",
    imgSrc: "/images/news1.svg",
  },
  {
    title:
      "It is stated that the performance of Dere Gamo Development and Business Corporation is at a good level",
    date: "Mar 20, 2023",
    imgSrc: "/images/news2.png",
  },
  {
    title:
      "Bola Zame Secondary School built by Gamo Development Association is inaugurated",
    date: "Mar 20, 2023",
    imgSrc: "/images/new3.png",
  },
  {
    title:
      "Gamo Development Association is offering various agricultural products at reasonable prices for society.",
    date: "Mar 20, 2023",
    imgSrc: "/images/news4.png",
  },
  {
    title: "It is stated that the performance of Dere Gamo Development",
    date: "Mar 20, 2023",
    imgSrc: "/images/news5.svg",
  },
];

const NewsGrid = () => {
  const router = useRouter();
  return (
    <div className="grid grid-cols-1 md:grid-cols-7 gap-6 p-4 md:mt-20 mt-8 w-4/5 mx-auto">
      <div
        onClick={() => router.push("/news/news-detail")}
        className="group relative lg:col-span-2 lg:block hidden cursor-pointer"
      >
        <Image
          src={newsItems[0].imgSrc}
          alt=""
          layout="responsive"
          unoptimized
          width={100}
          height={100}
        />
        <div className="absolute bottom-12 text-white left-7 text-left">
          <h2 className="group-hover:underline text-2xl font-bold mb-3">
            {newsItems[0].title.length > 60
              ? `${newsItems[0].title.slice(0, 60)}...`
              : newsItems[0].title}
          </h2>
          <div className="flex items-center space-x-3">
            <Image
              src="/images/calendar2.svg"
              alt=""
              unoptimized
              width={15}
              height={20}
            />
            <p className="text-white font-light text-sm">{newsItems[0].date}</p>
          </div>
        </div>
      </div>
      <div className="grid grid-cols-1 lg:col-span-3 md:col-span-7 gap-0">
        {newsItems?.slice(1, 4).map((item, id) => (
          <div
            onClick={() => router.push("/news/news-detail")}
            key={id}
            className="group flex flex-col items-start cursor-pointer"
          >
            <div className="flex flex-row text-start space-x-6 lg:mb-1 mb-4 ">
              <Image
                src={item.imgSrc}
                alt=""
                width={20}
                unoptimized
                height={20}
                className="lg:w-[31%] w-[38%]"
              />
              <div className="mt-2 md:pl-6 pl-0 lg:w-2/4">
                <h2 className="group-hover:underline md:text-xl text-xs font-bold md:mb-1 mb-2 text-[#1E1E1E]">
                  {item.title.length > 60
                    ? `${item.title.slice(0, 60)}...`
                    : item.title}
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
      <div
        onClick={() => router.push("/news/news-detail")}
        className="group cursor-pointer md:col-span-2 md:row-span-2 lg:block hidden"
      >
        <Image
          src={newsItems[4].imgSrc}
          unoptimized
          alt=""
          width={200}
          height={100}
        />
        <div className="mt-6 w-4/5 text-left">
          <h2 className="group-hover:underline text-xl font-bold mb-1 text-[#1E1E1E]">
            {newsItems[4].title.length > 60
              ? `${newsItems[4].title.slice(0, 60)}...`
              : newsItems[4].title}
          </h2>
          <div className="flex items-center space-x-3">
            <Image src="/images/calendar.svg" alt="" width={15} height={20} />
            <p className="text-[#1E1E1E] font-light">{newsItems[4].date}</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default NewsGrid;
