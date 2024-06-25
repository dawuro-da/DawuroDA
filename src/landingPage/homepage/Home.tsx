"use client";

import AboutSection from "./sections/AboutSection";

const Homepage = () => {
  return (
    <div className="h-full w-full text-center flex flex-cpl items-center justify-center">
      Home
      <div className="w-full">
        <AboutSection />
      </div>
    </div>
  );
};

export default Homepage;
