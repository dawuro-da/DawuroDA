"use client";

import Navigation from "../navigation/Navigation";
import AboutSection from "./sections/AboutSection";

const AboutPage = () => {
  return (
    <div>
      <div className="z-40 absolute top-0 w-full">
        <Navigation />
      </div>
      <AboutSection />
    </div>
  );
};

export default AboutPage;
