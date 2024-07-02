import Sidebar from "./Sidebar";
import { useState } from "react";
import Content, { contentData } from "./Content";
import AboutContent from "./contents/AboutContent";
import WhatWeDoContent from "./contents/WhatWeDoContent";
import PresidentMessage from "./contents/PresidentMessage";
import MissionContent from "./contents/MissionContent";
import BoardMember from "./contents/BoardMember";

const ContentRender = ({ content }: { content: string }) => {
  switch (content) {
    case "About":
      return <AboutContent />;
    case "What We Do":
      return <WhatWeDoContent />;
    case "President Message":
      return <PresidentMessage />;
    case "Mission, Vision, Goals":
      return <MissionContent />;
    case "Board Members":
      return <BoardMember />;
    case "Management":
      return <>Management</>;
    default:
      return null;
  }
};

const AboutSection = () => {
  const [content, setContent] = useState("About");
  const { borderColor } = contentData[content];

  return (
    <>
      <Content setContent={setContent} content={content} />
      <div className="md:w-4/5 w-full mx-auto pt-24 flex md:flex-row flex-col lg:mt-[180px] mt-[100px]">
        <Sidebar
          setContent={setContent}
          currentContent={content}
          borderColor={borderColor}
        />
        <div className="md:w-3/4 w-full lg:px-0 md:px-20 px-8">
          <ContentRender content={content} />
        </div>
      </div>
    </>
  );
};

export default AboutSection;
