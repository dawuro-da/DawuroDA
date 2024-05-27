"use client";

import { Book, Edit, SearchOutlined } from "@mui/icons-material";
import PageHeader from "../shared/PageHeader";
import Image from "next/image";
import { IconButton, TextField } from "@mui/material";
import { useState } from "react";
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
];
const CMS = () => {
  const [searching, setSearching] = useState<boolean>(false);
  const [searchText, setSearchText] = useState<string>("");

  return (
    <div className="h-full w-full overflow-y-auto">
      <PageHeader />
      <div className="lg:px-[40px] md:px-[40px] px-[20px] py-10 w-full flex flex-col flex-1">
        <small className="text-titleColor"> Contents:</small>
        <div className="flex flex-row items-center justify-start overflow-x-auto mt-4">
          {menues.map((item, index) => {
            const isActive = index === 4;
            return (
              <div
                key={index}
                className={` ${
                  isActive
                    ? "bg-[#7C7C7C] text-white border-[#7C7C7C] border-2"
                    : "text-[#7C7C7C] "
                } hover:border-[#7C7C7C] hover:border-2 cursor-pointer border-2 border-transparent border-l-2 border-l-[#d1d1d1] flex flex-col gap-1 items-center px-6 py-2`}
              >
                <Image
                  src={isActive ? item.iconActive : item.icon}
                  alt=""
                  width={25}
                  height={25}
                  className="h-[40px] w-[40px]"
                />
                <span className="capitalize">{item.name}</span>
              </div>
            );
          })}
        </div>
      </div>
      <div className="flex flex-row flex-1 mt-2 text-[#7C7C7C] h-full">
        <div className="h-full">
          <div className="lg:pl-[40px] md:pl-[40px] pl-[20px] py-4 pr-6 flex flex-col border-[1px] gap-4 border-[#d1d1d1] border-r-0 h-[140px]">
            <div className="flex flex-row justify-between items-center">
              <span className="font-bold text-xl">News</span>
              <span>
                <Edit />
                <span className="rotate-90 font-bold text-xl">...</span>
              </span>
            </div>
            <TextField
              fullWidth
              id="navbar-searchfield"
              size="small"
              name="searchText"
              variant="filled"
              value={searchText}
              onChange={(e) => {
                if (e.target.value === "") {
                  setSearching(!searching);
                }
                setSearchText(e.target.value);
              }}
              onKeyDown={(e) => {
                if (e.key === "Enter") {
                  setSearching(!searching);
                }
              }}
              hiddenLabel
              placeholder="Search by name, id, phone..."
              InputProps={{
                startAdornment: (
                  <IconButton
                    style={{
                      borderRadius: "16px",
                      borderLeft: 20,
                    }}
                    onClick={() => {
                      setSearching(!searching);
                    }}
                  >
                    <SearchOutlined style={{ color: "#555555" }} />
                  </IconButton>
                ),
                disableUnderline: true,
                sx: {
                  width: { md: "100%", lg: 300 },
                  color: "#555555",
                  backgroundColor: "#ffffff",
                  borderRadius: "16px",
                  paddingLeft: 0,
                  paddingRight: 2,
                },
              }}
            />
          </div>
        </div>
        <div className="border-[1px] border-[#d1d1d1] gap-4 flex-1 overflow-y-auto h-full">
          <div className="h-[139px] w-full border-b-[1px] border-[#d1d1d1] lg:pr-[40px] md:pr-[40px] pr-[20px] pl-6 flex flex-row items-center">
            Charitable Donations to boost productivity as a whole
          </div>
        </div>
      </div>
    </div>
  );
};

export default CMS;
