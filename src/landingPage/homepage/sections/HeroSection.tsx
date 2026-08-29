import Navigation from "@/landingPage/navigation/Navigation";
import { Button } from "@mui/material";
import { UserRole } from "@prisma/client";
import { useSession } from "next-auth/react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";

const slides = [
  {
    image: "/images/dawuro-culture-crowd.webp",
    headingKey: "home.heading_1",
    headingAccentKey: "home.heading_1_1",
  },
  {
    image: "/images/dawuro-farm.webp",
    headingKey: "home.heading_2",
    headingAccentKey: "home.heading_2_2",
  },
  {
    image: "/images/forestry.jpg",
    headingKey: "home.heading_4",
    headingAccentKey: "home.heading_4_4",
  },
  {
    image: "/images/dawuro-education.webp",
    headingKey: "home.heading_3",
    headingAccentKey: "home.heading_3_3",
  },
];

const AnimatedWords = ({
  text,
  startDelay = 0,
  className,
}: {
  text: string;
  startDelay?: number;
  className?: string;
}) => {
  const words = text.split(" ");
  return (
    <>
      {words.map((word, i) => (
        <span
          key={i}
          className={`hero-word ${className ?? ""}`}
          style={{ animationDelay: `${startDelay + i * 0.09}s` }}
        >
          {word}
          {i < words.length - 1 ? " " : ""}
        </span>
      ))}
    </>
  );
};

const HeroSection = () => {
  const session = useSession();
  const user = session.data?.user;
  const { t } = useTranslation();
  const router = useRouter();

  const [currentIndex, setCurrentIndex] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentIndex((prevIndex) => (prevIndex + 1) % slides.length);
    }, 10000); // Change slide every 10 seconds
    return () => clearInterval(interval);
  }, []);

  const prevSlide = () => {
    setCurrentIndex(
      (prevIndex) => (prevIndex - 1 + slides.length) % slides.length
    );
  };

  const nextSlide = () => {
    setCurrentIndex((prevIndex) => (prevIndex + 1) % slides.length);
  };

  const slide = slides[currentIndex];

  return (
    <div className="w-full z-10">
      <Navigation />
      <div className="relative h-[88vh] min-h-[620px] max-h-[900px] w-full bg-[#333333] overflow-hidden">
      {slides.map((s, index) => (
        <div
          key={s.image}
          className={`absolute inset-0 transition-opacity duration-1000 overflow-hidden ${
            index === currentIndex ? "opacity-100" : "opacity-0"
          }`}
        >
          <Image
            src={s.image}
            alt=""
            fill
            className={`w-[100%] h-[100%] object-cover ${
              index === currentIndex ? "hero-ken-burns" : ""
            }`}
          />
          <div className="absolute inset-0 bg-black/60" />
        </div>
      ))}
      <div
        key={currentIndex}
        className="leading-tight px-6 pb-28 absolute text-white text-center h-full w-full flex flex-col items-center justify-center gap-4 z-20"
      >
        <span
          className="hero-fade-up uppercase tracking-[3px] text-sm md:text-base font-semibold text-primaryColor"
          style={{ animationDelay: "0s" }}
        >
          {t("home.institution_name")}
        </span>
        <span className="max-w-4xl tracking-[-1px] xl:text-6xl lg:text-6xl text-4xl font-black mb-2 z-20">
          <AnimatedWords text={t(slide.headingKey)} startDelay={0.15} />{" "}
          <span className="text-primaryColor">
            <AnimatedWords text={t(slide.headingAccentKey)} startDelay={0.4} />
          </span>
        </span>
        <p
          className="hero-fade-up max-w-xl text-base md:text-xl mb-2 text-white/90"
          style={{ animationDelay: "0.65s" }}
        >
          {t("home.slogan")}
        </p>
        <div
          className="hero-fade-up flex flex-row justify-center gap-4 items-center"
          style={{ animationDelay: "0.8s" }}
        >
          {user?.role !== UserRole.Member && (
            <Button
              onClick={() => router.push("/login")}
              variant="outlined"
              className="bg-primaryColor border-2 hover:border-2 border-primaryColor hover:bg-white capitalize hover:text-primaryColor text-white font-bold py-2.5 px-6 rounded"
            >
              {t("home.join_us")}
            </Button>
          )}
          <Button
            onClick={() => router.push("/about")}
            variant="outlined"
            className="bg-transparent border-2 border-white capitalize hover:border-2 hover:border-white hover:bg-white hover:text-black text-white font-bold py-2.5 px-6 rounded"
          >
            {t("home.about_us")}
          </Button>
        </div>
      </div>

      <button
        onClick={prevSlide}
        aria-label="Previous slide"
        className="group absolute top-1/2 xl:lg:left-10 md:left-6 left-3 -translate-y-1/2 w-11 h-11 flex items-center justify-center rounded-full border border-white/40 bg-white/10 text-white backdrop-blur-sm transition-colors hover:bg-white hover:text-black z-30"
      >
        &#10094;
      </button>
      <button
        onClick={nextSlide}
        aria-label="Next slide"
        className="group absolute top-1/2 xl:lg:right-10 md:right-6 right-3 -translate-y-1/2 w-11 h-11 flex items-center justify-center rounded-full border border-white/40 bg-white/10 text-white backdrop-blur-sm transition-colors hover:bg-white hover:text-black z-30"
      >
        &#10095;
      </button>

      </div>
    </div>
  );
};

export default HeroSection;
