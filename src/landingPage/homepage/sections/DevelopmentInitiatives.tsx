import { Button, Skeleton } from "@mui/material";
import { Initiative } from "@prisma/client";
import axios from "axios";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import Slider from "react-slick";

const DevelopmentInitiatives = () => {
  const router = useRouter();
  const { i18n, t } = useTranslation();
  const isAmharic = Boolean(i18n.language === "am");
  const [screenSize, setScreenSize] = useState<number>();
  const [initiatives, setInitiatives] = useState<Initiative[]>();
  const [loading, setLoading] = useState(false);

  const fetchInitiatives = async () => {
    setLoading(true);
    try {
      const res = await axios.post("/api/cms/initiative/fetch", {
        page: 1,
        pageSize: 20,
      });
      if (res.data.success) {
        const latestInitiatives = res.data.value.initiatives;
        setInitiatives(latestInitiatives);
      }
    } catch (err) {
      console.error(err);
    }
    setLoading(false);
  };

  useEffect(() => {
    fetchInitiatives();
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
    <div id="initiatives" className="bg-[#F7F7F7] py-16">
      <h1 className="text-[#1E1E1E] font-bold lg:text-4xl text-lg mb-1 text-center">
        {t("home.development_initiatives_heading")}
      </h1>
      <p className="text-[#1E1E1E] font-light md:max-w-[25%] max-w-[65%] mx-auto text-center">
        {t("home.development_initiatives_subheading")}
      </p>
      <div className="w-4/5 mx-auto lg:mt-28 mt-16">
        <Slider {...settings} className="pb-10">
          {loading
            ? [1, 2, 3].map((item) => (
                <Skeleton key={item} className="w-full min-h-[300px]" />
              ))
            : initiatives?.map((initiative, id) => (
                <div
                  key={initiative.id}
                  className="mx-0 w-full h-full"
                  onClick={() => router.push(`/initiatives/${initiative.id}`)}
                >
                  <div className="group cursor-pointer hover:bg-white flex flex-col items-center justify-center gap-1 pb-10 h-full w-full">
                    <div
                      className="w-[85%] max-h-[350px] xl:lg:h-[300px] md:h-[250px] h-[200px]"
                      style={{
                        background: `url(${initiative.featuredImages?.[0]})`,
                        backgroundPosition: "center",
                        backgroundSize: "cover",
                        backgroundRepeat: "no-repeat",
                      }}
                    />
                    <p className="w-[85%] group-hover:underline text-start font-bold text-xl">
                      {!isAmharic
                        ? initiative.nameOfInitiative.slice(0, 60)
                        : initiative.nameOfInitiativeAmharic.slice(0, 60)}
                      {initiative.nameOfInitiative.length > 60 && "..."}
                    </p>
                    <p className="text-[#000000] text-start text-sm w-[85%]">
                      {!isAmharic
                        ? initiative.body.slice(0, 200)
                        : initiative.bodyAmharic.slice(0, 200)}
                      {initiative.body.length > 200 && "..."}
                    </p>
                    <div className="flex w-4/5 mt-6 items-center justify-start cursor-pointer">
                      <Button
                        variant="outlined"
                        className="text-black border-none hover:border-none capitalize hover:bg-none bg-none flex flex-row"
                      >
                        <span className="font-light">
                          {t("home.learn_more")}
                        </span>
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
