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

const Homepage = () => {
  return (
    <div className="w-full h-screen flex flex-col overflow-y-auto hiddenscrollbar">
      <HeroSection />
      <AboutSection />
      <DevelopmentInitiatives />
      <CampaignSection />
      <Partners />
      <LatestNews />
      <WhatsHappening />
      <FAQ />
      <Footer />
    </div>
  );
};

export default Homepage;
