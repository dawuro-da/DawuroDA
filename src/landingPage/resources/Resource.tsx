"use client";
import { I18nextProvider, useTranslation } from "react-i18next";
import Footer from "../footer/Footer";
import Naviagtion from "../navigation/Navigation";
import ResourceCard from "./sections/ResourceCard";
import useLanguageStore from "@/redux/languageStore";
import { useEffect } from "react";
import i18n from "../../../i18n";

const ResourcePage = () => {
  const { i18n: i18nn } = useTranslation();
  const { language } = useLanguageStore();

  useEffect(() => {
    i18nn.changeLanguage(language);
  }, [language, i18nn]);

  return (
    <I18nextProvider i18n={i18n}>
      <div>
        <div className="z-40 absolute top-0 w-full">
          <Naviagtion />
        </div>
        <div className="lg:mt-[180px] mt-[100px] gap-0 w-4/5 mx-auto mb-48">
          <ResourceCard />
        </div>
        <Footer />
      </div>
    </I18nextProvider>
  );
};

export default ResourcePage;
