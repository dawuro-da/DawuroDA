"use client";

import { Button } from "@mui/material";
import PageHeader from "../shared/PageHeader";
import { useRouter } from "next/navigation";
import { getFormattedDate } from "@/util/date";
import Image from "next/image";

const Auction = () => {
  const router = useRouter();
  return (
    <div className="h-full w-full overflow-y-auto">
      <PageHeader />
      <div className="lg:px-[40px] md:px-[40px] px-[20px] py-10 w-full flex flex-col flex-1 ">
        <div className="flex xl:lg:flex-row md:flex-row flex-col xl:lg:items-center md:items-center justify-between gap-2">
          <div className="flex flex-row items-center gap-6">
            <span className="text-titleColor font-bold text-3xl">
              Members List
            </span>
          </div>
          <div className="flex flex-row items-center gap-6">
            <Button
              onClick={() => router.push("/admin/dashboard/auction/add-auction")}
              variant="contained"
              className=" font-bold border-none bg-primaryColor text-white capitalize flex flex-row items-center gap-2 shadow-none"
            >
              <span>Add New Bid</span>
            </Button>
          </div>
        </div>
        <div className="flex flex-col w-full gap-6 mt-10">
          {[1, 2, 3, 4].map((item, index) => {
            return (
              <div className=" relative bg-white w-full rounded-2xl p-10 flex xl:flex-row lg:flex-row md:flex-row flex-col items-center gap-6">
                <div className="flex flex-col w-full">
                  <small>Title</small>
                  <span>
                    the addis ababa housing development corporation invites
                    bidders of consultancy service
                  </span>
                </div>

                <div className="border-l-2 pl-6 flex flex-row items-center justify-center gap-6 w-full">
                  <div className="flex flex-col">
                    <span className="font-bold">64</span>
                    <span className="text-xs">Bidders</span>
                  </div>
                  <div className="flex flex-col">
                    <span className="font-bold">4,400</span>
                    <span className="text-xs">Revenue from CPO sales</span>
                  </div>
                </div>
                <div className="flex flex-row items-center gap-6 justify-center w-full">
                  <div className="flex flex-col">
                    <span className="text-xs">start date</span>
                    <span className="">{getFormattedDate(new Date())}</span>
                  </div>
                  <div className="flex flex-col">
                    <span className="text-xs">end date</span>
                    <span className="">{getFormattedDate(new Date())}</span>
                  </div>
                </div>
                <div className="absolute cursor-pointer right-4 bottom-4 w-fit flex flex-row items-center">
                  <Image
                    src={"/icons/bx_edit.svg"}
                    alt=""
                    width={20}
                    height={20}
                  />
                  <small>Edit</small>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default Auction;
