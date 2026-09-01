"use client";

import Image from "next/image";
import MemberLogin from "./MemberLogin";
import MemberSignup from "./MemberSignup";
import { Suspense, useEffect, useState } from "react";
import { ArrowBack } from "@mui/icons-material";
import Link from "next/link";
import { I18nextProvider, useTranslation } from "react-i18next";
import useLanguageStore from "@/redux/languageStore";
import i18n from "../../../i18n";

// Text per slide reuses the exact same home.hero_title_* keys as the
// homepage hero (see HeroSection.tsx), matched to whichever of those 4
// themes best fits this page's own photo, so the copy shown here always
// stays in sync with the hero section's content.
const images = [
  {
    url: "/images/dawuro-education.webp",
    alt: "Image 1",
    headingKey: "home.hero_title_4",
    headingAccentKey: "home.hero_title_4_4",
  },
  {
    url: "/images/dawuro-culture-1.webp",
    alt: "Image 2",
    headingKey: "home.hero_title_1",
    headingAccentKey: "home.hero_title_1_1",
  },
  {
    url: "/images/dawuro-buffalo.webp",
    alt: "Image 3",
    headingKey: "home.hero_title_2",
    headingAccentKey: "home.hero_title_2_2",
  },
  {
    url: "/images/dawuro-water-project.webp",
    alt: "Image 4",
    headingKey: "home.hero_title_3",
    headingAccentKey: "home.hero_title_3_3",
  },
];

const MemberAuth = () => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isSignUp, setIsSignUp] = useState(false);
  const { i18n: i18nn, t } = useTranslation();
  const { language } = useLanguageStore();

  useEffect(() => {
    i18nn.changeLanguage(language);
  }, [language, i18nn]);

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
    <I18nextProvider i18n={i18n}>
      <div className="w-full h-screen overflow-y-auto flex xl:flex-row lg:flex-row">
        <div className="relative flex flex-row items-center justify-center w-full h-full overflow-y-auto">
          <Link href={"/"}>
            <div className="absolute xl:lg:flex hidden flex-row items-center gap-2 top-10 left-10 text-primaryColor w-fit z-40 hover:cursor-pointer hover:underline">
              <ArrowBack />
              <span>{t("members_dashboard.login.back_to_home")}</span>
            </div>
          </Link>
          {isSignUp ? (
            <MemberSignup setIsSignUp={setIsSignUp} />
          ) : (
            <Suspense>
              <MemberLogin setIsSignUp={setIsSignUp} />
            </Suspense>
          )}
        </div>
        <div className="relative w-[80%] h-full xl:block lg:block hidden">
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
                className="w-[100%] h-[100%] object-cover"
              />
            </div>
          ))}
          <div className="absolute inset-0 bg-black/50 z-10" />
          <div className="absolute text-white h-full w-full flex flex-col items-center justify-end pb-24 xl:lg:gap-6 gap-2 z-20">
            <div className="max-w-[500px] flex flex-row justify-center items-center text-center">
              {renderText(images[currentIndex], t)}
            </div>
          </div>
          <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 flex items-center space-x-2 z-30">
            {images.map((_, index) => (
              <button
                key={index}
                onClick={() => goToSlide(index)}
                className={`h-2.5 rounded-full transition-all duration-300 ${
                  index === currentIndex ? "w-8 bg-primaryColor" : "w-2.5 bg-white/50 hover:bg-white/80"
                }`}
              ></button>
            ))}
          </div>
        </div>
      </div>
    </I18nextProvider>
  );
};

export default MemberAuth;

const renderText = (
  image: { headingKey: string; headingAccentKey: string },
  t: any
) => (
  <span className="xl:text-4xl lg:text-4xl text-3xl font-bold mb-4 z-20">
    {t(image.headingKey)} <br />
    <span className="xl:text-6xl lg:text-6xl text-4xl w-[300px] z-10 bg-[url('/images/greenCurve.svg')] bg-contain bg-no-repeat">
      {t(image.headingAccentKey)}
    </span>
  </span>
);
