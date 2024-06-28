import Image from "next/image";

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
    title: "Support Our Mission: Donate Today!",
    date: "Mar 20, 2023",
    imgSrc: "/images/news4.svg",
  },
  {
    title: "Devastation in Gaza as Israel wages war on Hamas",
    date: "Mar 20, 2023",
    imgSrc: "/images/news5.svg",
  },
];

const NewsGrid = () => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-7 gap-6 p-4 md:mt-20 mt-8 w-4/5 mx-auto">
      <div className="relative lg:col-span-2 lg:block hidden">
        <Image
          src={newsItems[0].imgSrc}
          alt=""
          layout="responsive"
          width={100}
          height={100}
        />
        <div className="absolute bottom-12 text-white left-7 text-left">
          <h2 className="text-2xl font-bold mb-3">{newsItems[0].title}</h2>
          <div className="flex items-center space-x-3">
            <Image src="/images/calendar2.svg" alt="" width={15} height={20} />
            <p className="text-white font-light text-sm">{newsItems[0].date}</p>
          </div>
        </div>
      </div>
      <div className="grid grid-cols-1 lg:col-span-3 md:col-span-7 gap-0">
        {newsItems?.slice(1, 4).map((item, id) => (
          <div key={id} className="flex flex-col items-start">
            <div className="flex flex-row text-start space-x-6 lg:mb-1 mb-4">
              <Image src={item.imgSrc} alt="" width={20} height={20} className="lg:w-[31%] w-[38%]" />
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
                  <p className="text-[#1E1E1E] font-light lg:text-base text-xs">{item.date}</p>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
      <div className="md:col-span-2 md:row-span-2 lg:block hidden">
        <Image src={newsItems[4].imgSrc} alt="" width={200} height={100} />
        <div className="mt-6 w-4/5 text-left">
          <h2 className="text-xl font-bold mb-1 text-[#1E1E1E]">
            {newsItems[4].title}
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
