"use client";

import Image from "next/image";
import MemberLogin from "./MemberLogin";
import MemberSignup from "./MemberSignup";
import { useEffect, useState } from "react";
import { ArrowBack } from "@mui/icons-material";
import Link from "next/link";

const images = [
  { url: "/images/hero1.svg", alt: "Image 1" },
  { url: "/images/hero2.svg", alt: "Image 2" },
  { url: "/images/hero3.svg", alt: "Image 3" },
  { url: "/images/hero4.svg", alt: "Image 4" },
];

const MemberAuth = () => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isSignUp, setIsSignUp] = useState(false);

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
    <div className="w-full h-screen overflow-y-auto flex xl:flex-row lg:flex-row">
      <div className="relative w-[80%] h-full xl:block lg:block hidden">
        <Link href={"/"}>
          <div className="absolute flex flex-row items-center gap-2 top-10 left-10 text-white w-fit z-40 hover:cursor-pointer hover:underline">
            <ArrowBack />
            <span>Back to home</span>
          </div>
        </Link>
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
              className="w-[100%] h-[100%] object-cover filter "
            />
          </div>
        ))}
        <div className="absolute text-white h-full w-full flex flex-col items-center justify-end pb-24 xl:lg:gap-6 gap-2 z-20">
          <div className="max-w-[500px] flex flex-row justify-center items-center">
            {renderText(currentIndex)}
          </div>
        </div>
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
      <div className="flex flex-row items-center justify-center w-full">
        {isSignUp ? (
          <MemberSignup setIsSignUp={setIsSignUp} />
        ) : (
          <MemberLogin setIsSignUp={setIsSignUp} />
        )}
      </div>
    </div>
  );
};

export default MemberAuth;

const renderText = (currentIndex: number) => {
  switch (currentIndex) {
    case 0:
      return (
        <>
          <span className=" xl:text-4xl lg:text-4xl text-3xl font-bold mb-4 z-20 ">
            Empowering Communities Through Sustainable <br />
            <span className="xl:text-6xl lg:text-6xl text-4xl w-[300px] z-10 bg-[url('/images/greenCurve.svg')] bg-contain bg-no-repeat">
              Development
            </span>
          </span>
        </>
      );
    case 1:
      return (
        <>
          <span className="xl:text-4xl lg:text-4xl text-3xl font-bold mb-4 z-20">
            Advancing Sustainable Agriculture & Industry <br />
            <span className="xl:text-6xl lg:text-6xl text-4xl w-[300px] z-10 bg-[url('/images/greenCurve.svg')] bg-contain bg-no-repeat">
              Gamo Zone
            </span>
          </span>
        </>
      );
    case 2:
      return (
        <>
          <span className="xl:text-4xl lg:text-4xl text-3xl font-bold mb-4 z-20">
            Safeguarding Forests and Enviroments for <br />
            <span className="xl:text-6xl lg:text-6xl text-4xl w-[300px] z-10 bg-[url('/images/greenCurve.svg')] bg-contain bg-no-repeat">
              Generation
            </span>
          </span>
        </>
      );
    default:
      return (
        <>
          <span className="xl:text-4xl lg:text-4xl text-3xl font-bold mb-4 z-20">
            Elevating Education & Health Services for a
            <br />
            <span className="xl:text-6xl lg:text-6xl text-4xl w-[300px] z-10 bg-[url('/images/greenCurve.svg')] bg-contain bg-no-repeat">
              Brighter Future
            </span>
          </span>
        </>
      );
  }
};
