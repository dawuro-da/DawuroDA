"use client";

import PageHeader from "../shared/PageHeader";
import Image from "next/image";
import News from "./tabComponents/News";
import { useState } from "react";
import Events from "./tabComponents/Events";
import Initiatives from "./tabComponents/Initiatives";
import Partnerships from "./tabComponents/Partnership";
import Jobs from "./tabComponents/Jobs";
import Managements from "./tabComponents/Managements";
import Faq from "./tabComponents/Faq";
import Resource from "./tabComponents/Resource";
import Campaigns from "./tabComponents/Campaigns";

const menues = [
  {
    id: "news",
    name: "News",
    iconActive: "/icons/cms/newsActive.svg",
    icon: "/icons/cms/news.svg",
  },
  {
    id: "events",
    name: "Events",
    iconActive: "/icons/cms/eventsActive.svg",
    icon: "/icons/cms/events.svg",
  },
  {
    id: "initiatives",
    name: "Initiatives",
    iconActive: "/icons/cms/initiativesActive.svg",
    icon: "/icons/cms/initiatives.svg",
  },
  {
    id: "jobs",
    name: "Jobs",
    iconActive: "/icons/cms/jobsActive.svg",
    icon: "/icons/cms/jobs.svg",
  },
  {
    id: "partnerships",
    name: "Partnerships",
    iconActive: "/icons/cms/partnershipActive.svg",
    icon: "/icons/cms/partnership.svg",
  },
  {
    id: "managements",
    name: "Managements",
    iconActive: "/icons/cms/managementActive.svg",
    icon: "/icons/cms/management.svg",
  },
  {
    id: "faqs",
    name: "FAQs",
    iconActive: "/icons/cms/faqActive.svg",
    icon: "/icons/cms/faq.svg",
  },
  {
    id: "resources",
    name: "Resources",
    iconActive: "/icons/cms/newsActive.svg",
    icon: "/icons/cms/news.svg",
  },
  {
    id: "campaign",
    name: "Campaign",
    iconActive: "/icons/cms/campaignActive.svg",
    icon: "/icons/cms/campaign.svg",
  },
];

const CMS = () => {
  const [selectedTab, setSelectedTab] = useState<string>("news");
  const renderSelectedTab = (selected: string) => {
    switch (selected) {
      case "news":
        return <News />;
      case "events":
        return <Events />;
      case "initiatives":
        return <Initiatives />;
      case "partnerships":
        return <Partnerships />;
      case "jobs":
        return <Jobs />;
      case "managements":
        return <Managements />;
      case "faqs":
        return <Faq />;
      case "resources":
        return <Resource />;
      case "campaign":
        return <Campaigns />;
      default:
        return <News />;
    }
  };
  return (
    <div className="h-full w-full overflow-y-auto">
      <PageHeader />
      <div className="lg:px-[40px] md:px-[40px] px-[20px] py-10 w-full flex flex-col flex-1">
        <small className="text-titleColor"> Contents:</small>
        <div className="flex flex-row items-center justify-start w-full overflow-x-auto mt-4">
          {menues.map((item, index) => {
            const isActive = Boolean(item.id === selectedTab);
            return (
              <div
                key={index}
                className={` ${
                  isActive
                    ? "bg-[#7C7C7C] text-white border-[#7C7C7C] border-2"
                    : "text-[#7C7C7C] "
                } hover:border-[#b5b5b5] hover:border-2 cursor-pointer w-[120px]
                border-2 border-transparent border-l-2 border-l-[#d1d1d1] 
                flex flex-col gap-1 items-center px-6 py-2`}
                onClick={() => setSelectedTab(item.id)}
              >
                <Image
                  src={isActive ? item.iconActive : item.icon}
                  alt=""
                  width={25}
                  height={25}
                  className="h-[35px] w-[35px]"
                />
                <span className="capitalize">{item.name}</span>
              </div>
            );
          })}
        </div>
      </div>
      <div className="h-full w-full overflow-x-scroll overflow-y-clip">{renderSelectedTab(selectedTab)}</div>
    </div>
  );
};

export default CMS;
