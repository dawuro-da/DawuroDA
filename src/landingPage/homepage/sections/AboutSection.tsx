"use client";

import { Avatar } from "@mui/material";
import Slider from "react-slick";

const AboutSection = () => {
  const managers = [
    {
      url: "/images/image5.jpg",
      name: "Tagesse Chafo",
      title: "House of Peoples' Representative Chairman",
    },
    {
      url: "/images/image5.jpg",
      name: "Alemtsahay Abera",
      title: "House of Peoples' Representative Chairman",
    },
    {
      url: "/images/image5.jpg",
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
    <div className="w-full grid grid-cols-2">
      <div className="h-full w-full ">
        <Slider {...settings}>
          {managers.map((manager, index) => (
            <div key={index} className="mx-4 w-full">
              <div className="text-center flex flex-col items-center justify-center gap-1">
                <Avatar
                  style={{ height: 80, width: 80 }}
                  alt=""
                  src={manager.url}
                />
                <p className="font-bold">{manager.name}</p>
                <p className="text-gray-600">{manager.title}</p>
              </div>
            </div>
          ))}
        </Slider>
      </div>
    </div>
  );
};

export default AboutSection;
