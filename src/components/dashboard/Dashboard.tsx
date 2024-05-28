"use client";

import Image from "next/image";
import PageHeader from "../shared/PageHeader";
import { Button, MenuItem, Select } from "@mui/material";
import LineChartGraph from "./LineChartGraph";
import PieChartGraph from "./PieChartGraph";
import { useEffect, useState } from "react";
import StyledMenu from "../shared/StyledMenu";
import RecentMembers from "./RecentMembers";
import { useRouter } from "next/navigation";
import DateRangeSelector from "../shared/DateRangeSelector";
import { getFormattedDate } from "@/util/date";

const Dashboard = () => {
  const router = useRouter();
  const [anchorEl, setAnchorEl] = useState<null | Element>(null);
  const [dateAnchor, setDateAnchor] = useState<null | Element>(null);
  const [dateFilter, setDateFilter] = useState<{
    startDate: Date;
    endDate: Date;
  }>();

  const open = Boolean(anchorEl);
  const opendate = Boolean(dateAnchor);

  const handleClose = () => {
    setAnchorEl(null);
  };

  const handleDateClose = () => {
    setDateAnchor(null);
  };

  const cardsData = [
    {
      name: "Members",
      icon: "/icons/cardsUser.svg",
      amount: "3200",
      increment: "+2.5%",
      increased: true,
    },
    {
      name: "Donation",
      icon: "/icons/cardsDonation.svg",
      amount: "35.1K ETB",
      increment: "10 people donated",
      increased: false,
    },
    {
      name: "Contribution",
      icon: "/icons/cardsContribution.svg",
      amount: "2700 ETB",
      increment: "+3.5%",
      increased: true,
    },
  ];
  return (
    <>
      <StyledMenu anchorEl={anchorEl} open={open} onClose={handleClose}>
        <div>
          <MenuItem onClick={() => {}}>{"Download card data(.csv)"}</MenuItem>
          <MenuItem onClick={() => {}}>{"Download card data(.png)"}</MenuItem>
        </div>
      </StyledMenu>

      <StyledMenu
        anchorEl={dateAnchor}
        open={opendate}
        onClose={handleDateClose}
      >
        <div>
          <DateRangeSelector
            dateFilter={dateFilter}
            setDateFilter={setDateFilter}
          />
        </div>
      </StyledMenu>

      <div className="w-full h-full flex flex-col overflow-y-auto">
        <PageHeader />
        <div className=" relative w-full px-[40px] pt-10">
          <span className="text-titleColor font-bold text-3xl">Dashboard</span>
          <div className="grid xl:lg:grid-cols-3 md:grid-cols-2 gap-4 items-center pt-10">
            {cardsData.map((card, index) => {
              return (
                <div
                  key={index}
                  className="bg-white h-full rounded-[12px] p-4 flex flex-row items-center justify-between font-[300]"
                >
                  <div className="flex flex-row items-center gap-6">
                    <Image src={card.icon} alt="" height={60} width={60} />
                    <div className="flex flex-col">
                      <span>{card.name}</span>
                      <span className="text-2xl font-bold">{card.amount}</span>
                      <span>
                        <span
                          className={`${card.increased && "text-primaryColor"}`}
                        >
                          {card.increment}{" "}
                        </span>
                        since last week
                      </span>
                    </div>
                  </div>
                  <span
                    className="rotate-90 font-bold cursor-pointer hover:scale-125"
                    onClick={(e) => setAnchorEl(e.currentTarget)}
                  >
                    ...
                  </span>
                </div>
              );
            })}
          </div>
          <div className="flex flex-row items-center justify-between gap-6 mt-10">
            <div className="border-b-[1px] flex-1 border-b-titleColor opacity-50" />
            <div className="min-w-[130px]">
              <Button onClick={(e) => setDateAnchor(e.currentTarget)}>
                {dateFilter?.startDate && dateFilter?.endDate
                  ? `${getFormattedDate(
                      dateFilter?.startDate
                    )} - ${getFormattedDate(dateFilter?.endDate)}`
                  : "All Time"}
              </Button>
            </div>
          </div>
          <div className="grid xl:lg:grid-cols-2 xl:gap-12 lg:gap-8  mt-6">
            <div className="bg-white py-6 rounded-[8px] flex flex-col xl:min-h-[400px] lg:min-h-[400px] min-h-[300px] xl:lg:px-8 md:px-4 px-2">
              <div className="flex flex-row items-stretch justify-between lg:pl-10 md:pl-6 pl-2">
                <span className="text-[#555555] font-[800]">
                  Membership Growth Analytics
                </span>
                <div className="flex flex-row items-center gap-4">
                  <span
                    className="rotate-90 font-bold cursor-pointer hover:scale-125"
                    onClick={(e) => setAnchorEl(e.currentTarget)}
                  >
                    ...
                  </span>
                </div>
              </div>
              <div className=" flex-1 w-full max-h-[400px] mt-6">
                <LineChartGraph />
              </div>
            </div>
            <div className="bg-white py-6 rounded-[8px] flex flex-col xl:min-h-[400px] lg:min-h-[400px] min-h-[300px] xl:lg:px-8 md:px-4 px-2">
              <div className="flex flex-row items-stretch justify-between lg:pl-10 md:pl-6 pl-2">
                <span className="text-[#555555] font-[800]">
                  Members Payment Status
                </span>
                <div className="flex flex-row items-center gap-4">
                  <span
                    className="rotate-90 font-bold cursor-pointer hover:scale-125"
                    onClick={(e) => setAnchorEl(e.currentTarget)}
                  >
                    ...
                  </span>
                </div>
              </div>
              <div className=" flex-1 w-full max-h-[400px] mt-6">
                <PieChartGraph />
              </div>
            </div>
          </div>
        </div>
        <div className="w-full px-[40px] mt-10">
          <div className="flex flex-row justify-between items-center">
            <span className="text-titleColor font-bold text-3xl">
              Recently Registered Members
            </span>
            <Button
              onClick={() => router.push("/admin/dashboard/members")}
              variant={"outlined"}
              className="text-titleColor capitalize border-[1px] border-titleColor font-bold min-w-[130px]"
            >
              All Members
            </Button>
          </div>
          <div className="mt-6 w-full h-auto">
            <RecentMembers />
          </div>
        </div>
      </div>
    </>
  );
};

export default Dashboard;
