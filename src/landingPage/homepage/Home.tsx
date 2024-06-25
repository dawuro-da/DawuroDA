"use client";
import AboutSection from "./sections/AboutSection";
import HeroSection from "./sections/HeroSection";
import SupportRedSection from "./sections/SupportRedSection";

const Homepage = () => {
  return (
    <div className="w-full h-screen flex flex-col overflow-y-auto hiddenscrollbar">
      <HeroSection />
      <SupportRedSection />
      <AboutSection />
    </div>
  );
};

export default Homepage;
