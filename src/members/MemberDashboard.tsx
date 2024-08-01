"use client";

import Naviagtion from "@/landingPage/navigation/Navigation";
import { Avatar, Button, CircularProgress, Divider } from "@mui/material";
import Image from "next/image";
import HistoryAndAuction from "./components/HistoryAndAuction";
import {
  Contribution,
  Member,
  MembershipLevel,
  MembershipType,
} from "@prisma/client";
import { getFormattedDate, getMonthsSince } from "@/util/date";
import { useRouter } from "next/navigation";
import { useDispatch } from "react-redux";
import { showToastAction } from "@/redux/actions";
import axios from "axios";
import { useState } from "react";

const MemberDashboard = ({
  contributions,
  member,
}: {
  member?: Member;
  contributions?: Contribution[];
}) => {
  const dispatch = useDispatch();
  const router = useRouter();
  const [payLoading, setPayLoading] = useState(false);
  const isCompany = Boolean(member?.membershipType === MembershipType.Company);

  const handleContributionPayment = async () => {
    setPayLoading(true);
    try {
      const res = await axios.post("/api/payment/contributionPayment", {
        contributionAmount: member?.contributionAmount,
        email: member?.email,
        firstName: member?.firstName,
        lastName: member?.lastName,
        phone: member?.phone,
        institutionName: member?.institutionName,
      });
      if (res.data.success) {
        console.error();
        window.open(res.data.value.data.checkout_url, "_parent");
      } else {
        dispatch(showToastAction({ message: res.data.error, type: "error" }));
      }
    } catch (err) {
      console.warn(err);
      dispatch(showToastAction({ message: "Here is an item", type: "error" }));
    }
    setPayLoading(false);
  };

  return (
    <div className="w-full">
      <Naviagtion />
      <div className="h-full w-full xl:lg:px-40 md:px-20 px-10 bg-[#f5f5f5] py-10">
        <div className="flex xl:lg:flex-row md:flex-row flex-col gap-8">
          <span className="md:hidden block text-center">
            <strong>Welcome</strong>{" "}
            {!isCompany
              ? `${member?.firstName} ${member?.lastName}`
              : `${member?.institutionName}`}
          </span>
          <div className="flex flex-col gap-6 xl:lg:min-w-[340px] xl:lg:w-fit md:w-fit w-full ">
            <div className="p-8 rounded-[5px] flex flex-col gap-6 bg-white">
              <div className="flex flex-row items-center justify-between">
                <Avatar
                  src={member?.profileImage ?? ""}
                  className="xl:lg:h-[80px] xl:lg:w-[80px] h-[50px] w-[50px]"
                />
                <span className="flex flex-col gap-2">
                  <span className="text-xl">
                    {!isCompany
                      ? `${member?.firstName} ${member?.lastName}`
                      : `${member?.institutionName}`}
                  </span>
                  <span className="text-sm">
                    since:{" "}
                    {`${
                      member?.created_at && getFormattedDate(member?.created_at)
                    }`}
                  </span>
                </span>
              </div>
              <div className="flex flex-col gap-3 text-[14px] font-[300]">
                <div className="flex flex-row items-center justify-between">
                  <span>Subscription Level</span>
                  <span
                    className={`flex  flex-row items-center justify-center w-fit px-3 py-1 rounded-2xl ${
                      member?.membershipLevel === MembershipLevel.Platinium
                        ? "bg-[#34A8A8] text-white"
                        : member?.membershipLevel === MembershipLevel.Diamond
                        ? "bg-[#B0E0E62E] text-[#222222]"
                        : member?.membershipLevel === MembershipLevel.Gold
                        ? "bg-[#FFD7002E]"
                        : member?.membershipLevel === MembershipLevel.Siliver
                        ? "bg-[#C0C0C02E]"
                        : "bg-transparent"
                    }  rounded-[8px] min-w-20 text-center px-4 h-8 `}
                  >
                    {member?.membershipLevel}
                  </span>
                </div>
                <div className="flex flex-row items-center justify-between">
                  <span>Contribution System</span>
                  <span className="text-black bg-[#e2e2e2] px-3 py-1 rounded-2xl">
                    {member?.contributionSystem}
                  </span>
                </div>
                <div className="flex flex-row items-center justify-between">
                  <span>Unpaid Months</span>
                  <span className=" px-3 py-1 rounded-2xl">
                    {member?.nextDueDate && getMonthsSince(member?.nextDueDate)}
                  </span>
                </div>
                <Button
                  onClick={() => router.push("/member/profile")}
                  variant="outlined"
                  className="xl:lg:text-[14px] md:text-[14px] text-[12px] capitalize mt-6 border-2 border-[#222222] hover:border-2 hover:border-[#222222] text-[#222222] hover:text-white hover:bg-[#222222]"
                >
                  Go to profile overview
                </Button>
              </div>
            </div>
            <Button
              onClick={handleContributionPayment}
              variant="outlined"
              className="mt-6 border-2 capitalize text-[14px] border-primaryColor hover:border-2 hover:border-primaryColor text-white hover:text-primaryColor bg-primaryColor"
            >
              {payLoading ? <CircularProgress /> : "Pay"}
            </Button>
            <Divider textAlign="left">
              <span className="text-titleColor text-[14px]">Your Id</span>
            </Divider>
            <div className="bg-white h-[200px] w-full relative">
              <Button
                variant="outlined"
                className="absolute right-[15px] bottom-[15px] border-[#E0E0E0] text-[#7C7C7C] flex flex-row items-center capitalize gap-2 bg-white"
              >
                <Image
                  src={"/icons/download.svg"}
                  alt=""
                  width={20}
                  height={20}
                />
                Download
              </Button>
            </div>
          </div>
          <div className="flex flex-col flex-1 h-full w-full pt-4">
            <span className="md:block hidden">
              <strong>Welcome</strong>{" "}
              {!isCompany
                ? `${member?.firstName} ${member?.lastName}`
                : `${member?.institutionName}`}
            </span>
            <HistoryAndAuction contributions={contributions} />
          </div>
        </div>
      </div>
    </div>
  );
};

export default MemberDashboard;
