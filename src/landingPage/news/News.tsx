"use client";

import { I18nextProvider, useTranslation } from "react-i18next";
import Footer from "../footer/Footer";
import Naviagtion from "../navigation/Navigation";
import NewsCard from "./sections/NewsCard";
import useLanguageStore from "@/redux/languageStore";
import { useEffect } from "react";
import i18n from "../../../i18n";

const NewsPage = () => {
  const { i18n: i18nn } = useTranslation();
  const { language } = useLanguageStore();

  useEffect(() => {
    i18nn.changeLanguage(language);
  }, [language, i18nn]);

  return (
    <I18nextProvider i18n={i18n}>
      <div className="w-full">
        <Naviagtion />
        <NewsCard />

        <Footer />
      </div>
    </I18nextProvider>
  );
};

export default NewsPage;
