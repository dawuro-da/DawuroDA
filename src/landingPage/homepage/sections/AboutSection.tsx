"use client";

import { Avatar, Button } from "@mui/material";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import Slider from "react-slick";

const AboutSection = () => {
  const managers = [
    {
      url: "/images/tagese.svg",
      name: "Tagesse Chafo",
      title: "House of Peoples' Representative Chairman",
    },
    {
      url: "/images/image2.svg",
      name: "Alemtsahay Abera",
      title: "House of Peoples' Representative Chairman",
    },
    {
      url: "/images/image3.svg",
      name: "Tagesse Chafo",
      title: "House of Peoples' Representative Chairman",
    },
  ];
  const [isSmallScreen, setIsSmallScreen] = useState(false);

  useEffect(() => {
    if (window.innerWidth < 700) {
      setIsSmallScreen(true);
    } else {
      setIsSmallScreen(false);
    }
  }, []);

  const settings = {
    dots: true,
    infinite: true,
    speed: 500,
    slidesToShow: isSmallScreen ? 2 : 3,
    slidesToScroll: 1,
    nextArrow: <RightArrow />,
    prevArrow: <LeftArrow />,
  };

  const router = useRouter();

  return (
    <div className="xl:lg:px-40 md:px-20 px-10 grid items-center h-fit lg:grid-cols-2 grid-cols-1 mt-48 mb-36 w-full">
      <div className="lg:text-left text-center  w-full">
        <h6 className="text-[#000000] text-sm mb-7 font-light">About</h6>
        <h2 className="font-bold lg:text-4xl text-lg mb-7">
          Gamo Development Association
        </h2>
        <p className="text-[#6A6A6A] font-light mb-7 lg:max-w-[70%]">
          Gamo development association/GaDA/ envisions to create prosperous
          society through bringing holistic and sustainable development building
          up on Gamo culture of peace and coexistence. Building its
          institutional capacity, GaDA`s mission is to bring sustainable
          development in Gamo zone, which satisfy real community needs, through
          mobilizing natural and human resources closely working with local
          community and stakeholders.
        </p>
        <div className="flex space-x-5 lg:justify-start justify-center">
          <Button
            onClick={() => router.push("/about")}
            variant="outlined"
            className="px-7 hover:bg-[#ffffff] border-2 border-[#292929] hover:border-2 hover:border-[#292929] py-2 rounded-md text-white hover:text-[#222222] bg-[#222222]"
          >
            About Us
          </Button>
          <Button
            onClick={() => router.push("/about")}
            variant="outlined"
            className="px-7 hover:bg-[#292929] border-2 border-[#292929] hover:border-2 hover:border-[#292929] py-2 rounded-md text-[#292929] hover:text-[#ffffff] bg-[#ffffff]"
          >
            Board
          </Button>
        </div>
      </div>
      <div className=" mt-10 lg:mt-0 w-full h-full flex items-center">
        <div className="max-w-full max-h-full">
          <Slider {...settings}>
            {managers.map((manager, index) => (
              <div key={index} className="px-2">
                <div className="text-center flex flex-col items-center justify-center gap-1">
                  <Avatar
                    style={{ height: 85, width: 85 }}
                    alt=""
                    src={manager.url}
                  />
                  <p className="font-bold text-base ">{manager.name}</p>
                  <p className="text-[#000000] text-sm">{manager.title}</p>
                </div>
              </div>
            ))}
          </Slider>
        </div>
      </div>
    </div>
  );
};

export default AboutSection;

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
