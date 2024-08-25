"use client";
import { I18nextProvider, useTranslation } from "react-i18next";
import Footer from "../footer/Footer";
import Naviagtion from "../navigation/Navigation";
import ResourceCard from "./sections/ResourceCard";
import useLanguageStore from "@/redux/languageStore";
import { useEffect } from "react";
import i18n from "../../../i18n";

const ResourcePage = () => {
  const { i18n: i18nn, t } = useTranslation();
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
        <div className="lg:mt-[180px] mt-[100px] gap-0">
          <div className="xl:lg:px-40 md:px-20 px-10 w-full min-h-[500px] mb-48 flex flex-col gap-4">
            <div className="flex flex-col items-center justify-center">
              <div className="xl:lg:text-5xl md:text-5xl font-black text-3xl">
                {t("resources.resources_heading")}
              </div>
              <div className="text-xl">
                {t("resources.resources_subheading")}
              </div>
            </div>
            <ResourceCard />
          </div>
        </div>
        <Footer />
      </div>
    </I18nextProvider>
  );
};

export default ResourcePage;
