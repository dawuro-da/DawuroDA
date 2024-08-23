import Sidebar from "./Sidebar";
import { useState } from "react";
import Content from "./Content";
import AboutContent from "./contents/AboutContent";
import CEOMessage from "./contents/CEOMessage";
import MissionContent from "./contents/MissionContent";
import BoardMember from "./contents/BoardMember";
import ManagementMembers from "./contents/ManagementMembers";
import { useTranslation } from "react-i18next";

const ContentRender = ({ content }: { content: string }) => {
  switch (content) {
    case "About":
      return <AboutContent />;
    case "CEO Message":
      return <CEOMessage />;
    case "Mission, Vision, Goals":
      return <MissionContent />;
    case "Board Members":
      return <BoardMember />;
    case "Management":
      return <ManagementMembers />;
    default:
      return null;
  }
};

const AboutSection = () => {
  const [content, setContent] = useState("About");
  const { t } = useTranslation();
  const contentData: {
    [key: string]: {
      title: string;
      description: string;
      bgColor: string;
      borderColor: string;
    };
  } = {
    About: {
      title: t("about.about_heading"),
      description: t("about.about_heading_description"),
      bgColor: "bg-[#D2232C]",
      borderColor: "border-[#D2232C]",
    },
    "CEO Message": {
      title: t("about.CEO_message_heading"),
      description: t("about.CEO_message_heading_description"),
      bgColor: "bg-[#13A6D9]",
      borderColor: "border-[#13A6D9]",
    },
    "Mission, Vision, Goals": {
      title: t("about.vision_mission_values_heading"),
      description: t("about.vision_mission_values_heading_description"),
      bgColor: "bg-[#222222]",
      borderColor: "border-[#222222]",
    },
    "Board Members": {
      title: t("about.board_members_heading"),
      description: t("about.board_members_heading_description"),
      bgColor: "bg-[#F0DC35]",
      borderColor: "border-[#F0DC35]",
    },
    Management: {
      title: t("about.management_heading"),
      description: t("about.management_heading_description"),
      bgColor: "bg-teal-500",
      borderColor: "border-teal-500",
    },
  };
  
  const { borderColor } = contentData[content];

  return (
    <>
      <Content setContent={setContent} content={content} />
      <div className="md:w-4/5 w-full mx-auto pt-24 flex md:flex-row flex-col lg:mt-[180px] md:mt-[100px] mt-[60px]">
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
