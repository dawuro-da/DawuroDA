import Naviagtion from "@/landingPage/navigation/Navigation";
import { Button } from "@mui/material";
import Image from "next/image";
import { useEffect, useState } from "react";

const HeroSection = () => {
  const images = [
    { url: "/images/tractor.svg", alt: "Image 1" },
    { url: "/images/tractor2.svg", alt: "Image 2" },
  ];

  const [currentIndex, setCurrentIndex] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentIndex((prevIndex) => (prevIndex + 1) % images.length);
    }, 10000); // Change slide every 10 seconds
    return () => clearInterval(interval);
  }, []);

  const prevSlide = () => {
    setCurrentIndex(
      (prevIndex) => (prevIndex - 1 + images.length) % images.length
    );
  };

  const nextSlide = () => {
    setCurrentIndex((prevIndex) => (prevIndex + 1) % images.length);
  };

  const goToSlide = (index: number) => {
    setCurrentIndex(index);
  };

  return (
    <div className="relative min-h-screen w-full bg-[#333333] z-10 overflow-hidden">
      <div className="z-40 absolute top-0 w-full">
        <Naviagtion />
      </div>
      {images.map((image, index) => (
        <div
          key={index}
          className={`absolute inset-0 transition-opacity duration-1000 ${
            index === currentIndex ? "opacity-100" : "opacity-0"
          }`}
        >
          <Image
            src={image.url}
            alt={image.alt}
            fill
            className="w-[100%] h-[100%] object-cover filter brightness-30"
          />
        </div>
      ))}
      <div className="leading-10 xl:lg:px-40 md:px-20 px-10 absolute text-white h-full w-full xl:max-w-[80%] lg:max-w-[90%] flex flex-col items-center justify-center xl:lg:gap-6 gap-2 z-20">
        {renderText(currentIndex)}
      </div>

      <button
        onClick={prevSlide}
        className="absolute top-1/2 xl:lg:left-32 md:left-14 left-4 bg-[#00000005] transform -translate-y-1/2  bg-opacity-50 text-white p-2 py-12 rounded-full z-30"
      >
        &#10094;
      </button>
      <button
        onClick={nextSlide}
        className="absolute top-1/2 xl:lg:right-32 md:right-14 right-4 bg-[#0000000 transform -translate-y-1/2 py-12 bg-opacity-50 text-white p-2 rounded-full z-30"
      >
        &#10095;
      </button>

      <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 flex space-x-2 z-30">
        {images.map((_, index) => (
          <button
            key={index}
            onClick={() => goToSlide(index)}
            className={`w-3 h-3 rounded-full ${
              index === currentIndex ? "bg-white" : "bg-gray-500"
            }`}
          ></button>
        ))}
      </div>
    </div>
  );
};

export default HeroSection;

const renderText = (currentIndex: number) => {
  switch (currentIndex) {
    case 0:
      return (
        <>
          {/* <span className="w-full">Gamo Development Association</span> */}
          <span className="xl:text-7xl lg:text-6xl text-4xl font-bold mb-4 z-20 pt-6">
            Empowering Communities Through Sustainable <br />
            <span className="w-[300px] z-10 bg-[url('/images/greenCurve.svg')] bg-contain bg-no-repeat">
              Development
            </span>
          </span>
          <p className="text-lg md:text-2xl mb-6 w-full">
            Fostering sustainable growth and community well-being in Gamo Zone.
          </p>
          <div className="w-full flex flex-row xl:lg:justify-start md:justify-start gap-8 justify-between items-center ">
            <Button
              variant="outlined"
              className="bg-primaryColor hover:bg-white hover:text-primaryColor text-white font-bold py-2 px-4 rounded"
            >
              Join Us
            </Button>
            <Button
              variant="outlined"
              className="bg-transparent border-2 border-white hover:border-2 hover:border-white hover:bg-white hover:text-black text-white font-bold py-2 px-4 rounded"
            >
              About Us
            </Button>
          </div>
        </>
      );
    case 1:
      return (
        <>
          <span className="w-full">Gamo Development Association</span>
          <span className="xl:text-7xl lg:text-6xl text-4xl font-bold mb-4 z-20">
            Advancing Sustainable Agriculture & Industry <br />
            <span className="w-[300px] z-10 bg-[url('/images/greenCurve.svg')] bg-contain bg-no-repeat">
              Gamo Zone
            </span>
          </span>
          <p className="text-lg md:text-2xl mb-6 w-full">
            Fostering sustainable growth and community well-being in Gamo Zone.
          </p>
          <div className="w-full flex flex-row xl:lg:justify-start md:justify-start gap-8 justify-between items-center ">
            <Button
              variant="outlined"
              className="bg-primaryColor hover:bg-white hover:text-primaryColor text-white font-bold py-2 px-4 rounded"
            >
              Join Us
            </Button>
            <Button
              variant="outlined"
              className="bg-transparent border-2 border-white hover:border-2 hover:border-white hover:bg-white hover:text-black text-white font-bold py-2 px-4 rounded"
            >
              About Us
            </Button>
          </div>
        </>
      );
    case 2:
      return (
        <>
          <span className="w-full">Gamo Development Association</span>
          <span className="xl:text-7xl lg:text-6xl text-4xl font-bold mb-4 z-20">
            Safeguarding Forests and Enviroments for <br />
            <span className="w-[300px] z-10 bg-[url('/images/greenCurve.svg')] bg-contain bg-no-repeat">
              Generation
            </span>
          </span>
          <p className="text-lg md:text-2xl mb-6 w-full">
            Fostering sustainable growth and community well-being in Gamo Zone.
          </p>
          <div className="w-full flex flex-row xl:lg:justify-start md:justify-start gap-8 justify-between items-center ">
            <Button
              variant="outlined"
              className="bg-primaryColor hover:bg-white hover:text-primaryColor text-white font-bold py-2 px-4 rounded"
            >
              Join Us
            </Button>
            <Button
              variant="outlined"
              className="bg-transparent border-2 border-white hover:border-2 hover:border-white hover:bg-white hover:text-black text-white font-bold py-2 px-4 rounded"
            >
              About Us
            </Button>
          </div>
        </>
      );
    default:
      return (
        <>
          <span className="w-full">Gamo Development Association</span>
          <span className="xl:text-7xl lg:text-6xl text-4xl font-bold mb-4 z-20">
            Elevating Education & Health Services for a
            <br />
            <span className="w-[300px] z-10 bg-[url('/images/greenCurve.svg')] bg-contain bg-no-repeat">
              Brighter Future
            </span>
          </span>
          <p className="text-lg md:text-2xl mb-6 w-full">
            Fostering sustainable growth and community well-being in Gamo Zone.
          </p>
          <div className="w-full flex flex-row xl:lg:justify-start md:justify-start gap-8 justify-between items-center ">
            <Button
              variant="outlined"
              className="bg-primaryColor hover:bg-white hover:text-primaryColor text-white font-bold py-2 px-4 rounded"
            >
              Join Us
            </Button>
            <Button
              variant="outlined"
              className="bg-transparent border-2 border-white hover:border-2 hover:border-white hover:bg-white hover:text-black text-white font-bold py-2 px-4 rounded"
            >
              About Us
            </Button>
          </div>
        </>
      );
  }
};
