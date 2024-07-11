import { Avatar, Button } from "@mui/material";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import Slider from "react-slick";

const DevelopmentInitiatives = () => {
  const router = useRouter();
  const [screenSize, setScreenSize] = useState<number>();
  const Initiatives = [
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
  useEffect(() => {
    setScreenSize(window.innerWidth);
  }, []);

  const settings = {
    dots: true,
    infinite: true,
    speed: 500,
    slidesToScroll: 1,
    slidesToShow: screenSize && screenSize < 800 ? 1 : 3,
    nextArrow: <RightArrow />,
    prevArrow: <LeftArrow />,
  };

  return (
    <div className="bg-[#F7F7F7] py-16">
      <h1 className="text-[#1E1E1E] font-bold lg:text-4xl text-lg mb-1 text-center">
        Development Initiatives
      </h1>
      <p className="text-[#1E1E1E] font-light md:max-w-[25%] max-w-[65%] mx-auto text-center">
        Fostering sustainable growth and community well-being in Gamo Zone.
      </p>
      <div className="w-4/5 mx-auto lg:mt-28 mt-16">
        <Slider {...settings} className="pb-10">
          {Initiatives.map((Initiative, id) => (
            <div
              key={id}
              className="mx-0 w-full"
              onClick={() => router.push("/initiatives/id")}
            >
              <div className="group cursor-pointer hover:bg-white flex flex-col items-center justify-center gap-1 pb-10">
                <Avatar
                  style={{ height: "100%", width: "85%", borderRadius: "0px" }}
                  alt=""
                  src={Initiative.url}
                />
                <p className="w-[85%] group-hover:underline text-start font-bold text-xl">
                  {Initiative.title}
                </p>
                <p className="text-[#000000] text-start text-sm w-[85%]">
                  {Initiative.description}
                </p>
                <div className="flex w-4/5 mt-6 items-center justify-start cursor-pointer">
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
        </Slider>
      </div>
    </div>
  );
};

export default DevelopmentInitiatives;

const RightArrow = (props: any) => {
  const { className, style, onClick } = props;
  return (
    <div
      onClick={onClick}
      style={style}
      className={`${className} rounded-full bg-white  flex flex-row items-center justify-center`}
    >
      <Image
        src={"/images/arrowdown.svg"}
        className="-rotate-90"
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
      className={`${className} rounded-full bg-white  flex flex-row items-center justify-center`}
    >
      <Image
        src={"/images/arrowdown.svg"}
        className="rotate-90"
        alt=""
        height={20}
        width={20}
      />
    </div>
  );
};
