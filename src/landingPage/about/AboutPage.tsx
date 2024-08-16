"use client";

import { I18nextProvider, useTranslation } from "react-i18next";
import Footer from "../footer/Footer";
import Navigation from "../navigation/Navigation";
import AboutSection from "./sections/AboutSection";
import i18n from "../../../i18n";
import { useEffect } from "react";
import useLanguageStore from "@/redux/languageStore";

const AboutPage = () => {
  const { i18n: i18nn } = useTranslation();
  const { language } = useLanguageStore();

  useEffect(() => {
    i18nn.changeLanguage(language);
  }, [language, i18nn]);

  return (
    <I18nextProvider i18n={i18n}>
      <div>
        <div className="z-40 absolute top-0 w-full">
          <Navigation />
        </div>

        <div className="min-h-fit pb-32">
          <AboutSection />
        </div>
        <Footer />
      </div>
    </I18nextProvider>
  );
};

export default AboutPage;
