"use client";

import AboutSection from "./sections/AboutSection";
import DevelopmentInitiatives from "./sections/DevelopmentInitiatives";
import FAQ from "./sections/FAQ";
import Footer from "./sections/Footer";
import LatestNews from "./sections/LatestNews";
import Partners from "./sections/Partners";
import WhatsHappening from "./sections/WhatsHappening";

const Homepage = () => {
  return (
    <div className="h-full w-full text-center flex flex-cpl items-center justify-center">
      
      <div className="w-full">
        {/* <AboutSection /> */}
        <DevelopmentInitiatives />
        <Partners />
        <LatestNews />
        <WhatsHappening />
        <FAQ />
        <Footer />
      </div>
    </div>
  );
};

export default Homepage;
