"use client";

import Footer from "../footer/Footer";
import Navigation from "../navigation/Navigation";
import AboutSection from "./sections/AboutSection";

const AboutPage = () => {
  return (
    <div>
      <div className="z-40 absolute top-0 w-full">
        <Navigation />
      </div>
      <div className="min-h-fit pb-32">
        <AboutSection />
      </div>
      <Footer />
    </div>
  );
};

export default AboutPage;
