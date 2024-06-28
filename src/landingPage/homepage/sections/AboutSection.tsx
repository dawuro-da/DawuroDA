"use client";

import { Avatar } from "@mui/material";
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

  const settings = {
    dots: true,
    infinite: true,
    speed: 500,
    slidesToShow: 3,
    slidesToScroll: 1,
  };

  return (
    <div className="xl:lg:px-40 md:px-20 px-10 grid items-center h-fit lg:grid-cols-2 grid-cols-1 mt-48 mb-36 w-full">
      <div className="lg:text-left text-center  w-full">
        <h6 className="text-[#000000] text-sm mb-7 font-light">About</h6>
        <h2 className="font-bold lg:text-4xl text-lg mb-7">
          Gamo Development Association
        </h2>
        <p className="text-[#6A6A6A] font-light mb-7 lg:max-w-[70%]">
          Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do
          eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad
          minim veniam, quis nostrud exercitation ullamco laboris nisi ut
          aliquip ex ea commodo consequat.{" "}
        </p>
        <div className="flex space-x-5 lg:justify-start justify-center">
          <button className="px-7 py-2 rounded-md text-white bg-[#222222]">
            About Us
          </button>
          <button className="px-7 py-2 rounded-md bg-white border border-[#ADADAD] text-[#1E1E1E]">
            Board
          </button>
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
