"use client";
import HeroSection from "./sections/HeroSection";
import CampaignSection from "./sections/CampaignSection";
import AboutSection from "./sections/AboutSection";
import DevelopmentInitiatives from "./sections/DevelopmentInitiatives";
import FAQ from "./sections/FAQ";
import Footer from "../footer/Footer";
import LatestNews from "./sections/LatestNews";
import Partners from "./sections/Partners";
import WhatsHappening from "./sections/WhatsHappening";
import { I18nextProvider, useTranslation } from "react-i18next";
import useLanguageStore from "@/redux/languageStore";
import { useEffect } from "react";
import i18n from "../../../i18n";

const Homepage = () => {
  const { i18n: i18nn } = useTranslation();
  const { language } = useLanguageStore();

  useEffect(() => {
    i18nn.changeLanguage(language);
  }, [language, i18nn]);

  return (
    <I18nextProvider i18n={i18n}>
      <div className="w-full h-screen flex flex-col overflow-y-auto hiddenscrollbar">
        <HeroSection />
        <AboutSection />
        <DevelopmentInitiatives />
        <LatestNews />
        <CampaignSection />
        <Partners />
        <WhatsHappening />
        <FAQ />
        <Footer />
      </div>
    </I18nextProvider>
  );
};

export default Homepage;
