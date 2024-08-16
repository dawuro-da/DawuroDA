"use client";
import { I18nextProvider, useTranslation } from "react-i18next";
import Footer from "../../footer/Footer";
import Naviagtion from "../../navigation/Navigation";
import JobDetailPage from "./sections/JobDetailPage";
import useLanguageStore from "@/redux/languageStore";
import { useEffect } from "react";
import i18n from "../../../../i18n";

const JobDetail = () => {
  const { i18n: i18nn } = useTranslation();
  const { language } = useLanguageStore();

  useEffect(() => {
    i18nn.changeLanguage(language);
  }, [language, i18nn]);

  return (
    <I18nextProvider i18n={i18n}>
      <div className="bg-[#F5F5F5] min-h-screen flex flex-col">
        <div className="z-40 absolute top-0 w-full">
          <Naviagtion />
        </div>
        <div className="w-4/5 mx-auto lg:mt-[180px] mt-[100px] pb-48 ">
          <JobDetailPage />
        </div>
        <Footer />
      </div>
    </I18nextProvider>
  );
};

export default JobDetail;
