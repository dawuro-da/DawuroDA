import Naviagtion from "@/landingPage/navigation/Navigation";
import { Avatar, Button, Divider } from "@mui/material";
import Image from "next/image";
import HistoryAndAuction from "./components/HistoryAndAuction";

const MemberDashboard = () => {
  return (
    <div className="w-full">
      <Naviagtion />
      <div className="h-full w-full xl:lg:px-40 md:px-20 px-10 bg-[#f5f5f5] py-10">
        <div className="flex flex-row gap-8">
          <div className="flex flex-col gap-6 min-w-[340px] ">
            <div className="p-8 rounded-[5px] flex flex-col gap-6 bg-white">
              <div className="flex flex-row items-center justify-between">
                <Avatar className="h-[80px] w-[80px]" />
                <span className="flex flex-col gap-2">
                  <span className="text-xl">Alemu Getahun</span>
                  <span className="text-sm">since: 10 May, 2022</span>
                </span>
              </div>
              <div className="flex flex-col gap-3 text-[14px] font-[300]">
                <div className="flex flex-row items-center justify-between">
                  <span>Subscription Level</span>
                  <span className="text-white bg-[#9fd7d5] px-3 py-1 rounded-2xl">
                    Platinium
                  </span>
                </div>
                <div className="flex flex-row items-center justify-between">
                  <span>Contribution System</span>
                  <span className="text-white bg-[#e2e2e2] px-3 py-1 rounded-2xl">
                    Quarterly
                  </span>
                </div>
                <div className="flex flex-row items-center justify-between">
                  <span>Unpaid Months</span>
                  <span className=" px-3 py-1 rounded-2xl">0</span>
                </div>
                <Button
                  variant="outlined"
                  className="mt-6 border-2 border-[#222222] hover:border-2 hover:border-[#222222] text-[#222222] hover:text-white hover:bg-[#222222]"
                >
                  Go to profile overview
                </Button>
              </div>
            </div>
            <Button
              variant="outlined"
              className="mt-6 border-2 border-primaryColor hover:border-2 hover:border-primaryColor text-white hover:text-primaryColor bg-primaryColor"
            >
              Pay
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
            <span>
              <strong>Welcome</strong> Alemu Getahun
            </span>
            <HistoryAndAuction />
          </div>
        </div>
      </div>
    </div>
  );
};

export default MemberDashboard;
