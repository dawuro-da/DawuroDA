"use client";

import Image from "next/image";
import PageHeader from "../shared/PageHeader";
import { Button, MenuItem } from "@mui/material";
import LineChartGraph from "./LineChartGraph";
import PieChartGraph from "./PieChartGraph";
import { useEffect, useRef, useState } from "react";
import StyledMenu from "../shared/StyledMenu";
import RecentMembers from "./RecentMembers";
import { useRouter } from "next/navigation";
import { formatNumberToKOrM } from "@/util/date";
import axios from "axios";
import { downloadExcel } from "@/util/helper";

interface DashboardData {
  contributionStatus: {
    isIncreased: boolean;
    percentage: boolean;
  };
  donations: number;
  donationsSinceLastWeek: number;
  memberSinceLastWeek: number;
  totalContributions: number;
  totalMember: number;
}

const Dashboard = () => {
  const router = useRouter();
  const [selectedMenu, setSelectedMenu] = useState<any>();
  const [anchorEl, setAnchorEl] = useState<null | Element>(null);
  const [dashboardData, setDashboardData] = useState<DashboardData>();
  const [clickedMenu, setClickedMenu] = useState<string>();
  const open = Boolean(anchorEl);

  const handleClose = () => {
    setAnchorEl(null);
  };

  const fetchDashboardData = async () => {
    const result = await axios.get("/api/dashboard");

    if (result.status === 200) {
      setDashboardData(result.data.value);
    }
  };

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const divRef = useRef(null);
  const divRef1 = useRef(null);
  const divRef2 = useRef(null);

  const cardsData = [
    {
      name: "Members",
      icon: "/icons/cardsUser.svg",
      amount: `${dashboardData?.totalMember.toLocaleString() ?? 0}`,
      increment: `${dashboardData?.memberSinceLastWeek ?? 0} members`,
      increased: true,
      since: "Since Last week",
    },
    {
      name: "Donation",
      icon: "/icons/cardsDonation.svg",
      amount: `${
        dashboardData?.donations
          ? formatNumberToKOrM(dashboardData?.donations)
          : "0"
      } ETB`,
      increment: `${dashboardData?.donationsSinceLastWeek ?? 0} people`,
      since: "Since Last week",
      increased: true,
    },
    {
      name: "Contribution",
      icon: "/icons/cardsContribution.svg",
      amount: `${
        dashboardData?.totalContributions
          ? formatNumberToKOrM(dashboardData?.totalContributions)
          : 0
      } ETB`,
      increment: `${
        dashboardData?.totalContributions
          ? dashboardData?.contributionStatus.isIncreased
            ? " + "
            : " - "
          : ""
      } ${dashboardData?.contributionStatus.percentage ?? 0}%`,
      since: "Since Last month",
      increased: dashboardData?.contributionStatus.isIncreased,
    },
  ];

  const prepareURL = async (currTarget: any) => {
    const cardElement = currTarget;
    setAnchorEl(null);
    if (!cardElement) return;

    try {
      // lazy load this package
      const html2canvas = await import(
        /* webpackPrefetch: true */ "html2canvas"
      );

      const result = await html2canvas.default(cardElement);

      const asURL = result.toDataURL("image/jpeg");
      // as far as I know this is a quick and dirty solution
      const anchor = document.createElement("a");
      anchor.href = asURL;
      anchor.download = "your-card.jpeg";
      anchor.click();
      anchor.remove();
      // maybe this part should set state with `setURLData(asURL)`
      // and when that's set to something you show the download button
      // which has `href=URLData`, so that people can click on it
    } catch (err) {
      console.error(err);
    }
  };

  // const handleGeneratePDF = useReactToPrint({
  //   content: () =>
  //     clickedMenu === "Members"
  //       ? divRef.current
  //       : clickedMenu === "Donation"
  //       ? divRef1.current
  //       : divRef2.current,
  //   documentTitle: "Card",
  // });
  const handleGeneratePDF = () => {
    const currTarget =
      clickedMenu === "Members"
        ? divRef.current
        : clickedMenu === "Donation"
        ? divRef1.current
        : divRef2.current;
    prepareURL(currTarget);
  };

  const handleDownloadCSV = () => {
    setAnchorEl(null);
    switch (clickedMenu) {
      case "Contribution":
        return downloadExcel(
          [
            {
              name: "total contribution",
              count: dashboardData?.totalContributions,
            },
          ],
          "contributionCard"
        );
      case "Donation":
        return downloadExcel(
          [{ name: "total donations", count: dashboardData?.donations }],
          "donationCard"
        );
      case "Members":
        return downloadExcel(
          [{ name: "total members", count: dashboardData?.totalMember }],
          "membersCard"
        );
    }
  };
  return (
    <>
      <StyledMenu anchorEl={anchorEl} open={open} onClose={handleClose}>
        <div>
          <MenuItem onClick={handleDownloadCSV}>
            {"Download card data(.csv)"}
          </MenuItem>
          <MenuItem onClick={handleGeneratePDF}>
            {"Download card data(.png)"}
          </MenuItem>
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
                  ref={index === 0 ? divRef : index === 1 ? divRef1 : divRef2}
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
                          className={`${
                            card.increased
                              ? "text-primaryColor"
                              : "text-red-500"
                          }`}
                        >
                          {card.increment}{" "}
                        </span>
                        {card.since}
                      </span>
                    </div>
                  </div>
                  <span
                    className="rotate-90 font-bold cursor-pointer hover:scale-125"
                    onClick={(e) => {
                      setSelectedMenu(e);
                      setClickedMenu(card.name);
                      setAnchorEl(e.currentTarget);
                    }}
                  >
                    ...
                  </span>
                </div>
              );
            })}
          </div>
          <div className="flex flex-row items-center justify-between gap-6 mt-10">
            <div className="border-b-[1px] flex-1 border-b-titleColor opacity-50" />
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
