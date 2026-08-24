import { Button } from "@mui/material";
import { ArrowForward } from "@mui/icons-material";
import NewsGrid from "./NewsGrid";
import { useRouter } from "next/navigation";
import { useTranslation } from "react-i18next";

const LatestNews = () => {
  const router = useRouter();
  const { t } = useTranslation();
  return (
    <div className="bg-[#F7F7F7] py-16 flex flex-col items-center w-full">
      <div className="w-full xl:lg:px-40 md:px-20 px-10 flex flex-row items-end justify-between mb-10 gap-4">
        <div>
          <span className="text-primaryColor font-semibold text-sm uppercase tracking-wide">
            {t("news.news")}
          </span>
          <h2 className="font-bold lg:text-4xl md:text-2xl text-xl text-[#1E1E1E] mt-2">
            {t("home.latest_news_heading")}
          </h2>
          <p className="mt-2 font-light text-titleColor max-w-md hidden md:block">
            {t("home.latest_news_subheading")}
          </p>
        </div>
        <Button
          onClick={() => router.push("/news")}
          variant="outlined"
          endIcon={<ArrowForward />}
          className="shrink-0 px-6 py-2.5 text-white capitalize rounded bg-primaryColor border-2 border-primaryColor hover:bg-white hover:text-primaryColor"
        >
          {t("home.news")}
        </Button>
      </div>
      <NewsGrid />
    </div>
  );
};

export default LatestNews;
