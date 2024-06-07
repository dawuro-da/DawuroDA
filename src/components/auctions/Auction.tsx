"use client";

import { Button, CircularProgress, IconButton, TextField } from "@mui/material";
import PageHeader from "../shared/PageHeader";
import { useRouter } from "next/navigation";
import { getFormattedDate } from "@/util/date";
import Image from "next/image";
import { showToastAction } from "@/redux/actions";
import axios from "axios";
import { FieldValues } from "react-hook-form";
import { useEffect, useState } from "react";
import { useDispatch } from "react-redux";
import { Auction } from "@prisma/client";
import { PageState } from "../shared/CustomizedDatagrid";
import { SearchOutlined } from "@mui/icons-material";
import EditAuction from "./EditAuction";

const Auction = () => {
  const router = useRouter();
  const [refetch, setRefetch] = useState<boolean>(false);
  const [fetchLoading, setfetchLoading] = useState<boolean>(false);
  const [searchText, setSearchText] = useState<string>("");
  const [auctions, setAuctions] = useState<Auction[]>();
  const [totalCount, setTotalCount] = useState<number>(0);
  const [selectedAuction, setSelectedAuction] = useState<Auction>();
  const [openEditDrawer, setOpenEditDrawer] = useState(false);

  const fetchAuction = async ({ page, pageSize }: PageState) => {
    setfetchLoading(true);
    const result = await axios.post("/api/auction/fetch", {
      page,
      pageSize,
      searchText,
    });

    if (result.data.success) {
      setAuctions(result.data.value.auctions);
      setTotalCount(result.data.value.total);
    }
    setfetchLoading(false);
  };

  useEffect(() => {
    fetchAuction({ page: 1, pageSize: 30 });
  }, [refetch]);

  return (
    <div className="h-full w-full overflow-y-auto">
      <PageHeader />
      <div className="lg:px-[40px] md:px-[40px] px-[20px] py-10 w-full flex flex-col flex-1 ">
        <div className="flex xl:lg:flex-row md:flex-row flex-col xl:lg:items-center md:items-center justify-between gap-2">
          <div className="flex flex-row items-center gap-6">
            <span className="text-titleColor font-bold text-3xl">
              Auctions List
            </span>
          </div>
          <div className="grid xl:grid-cols-3 lg:grid-cols-3 md:grid-cols-3 items-center justify-end gap-6">
            <TextField
              className="col-span-2"
              fullWidth
              id="navbar-searchfield"
              size="small"
              name="searchText"
              variant="filled"
              value={searchText}
              onChange={(e) => {
                if (e.target.value === "") {
                  setRefetch(!refetch);
                }
                setSearchText(e.target.value);
              }}
              onKeyDown={(e) => {
                if (e.key === "Enter") {
                  setRefetch(!refetch);
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
                      setRefetch(!refetch);
                    }}
                  >
                    <SearchOutlined style={{ color: "#555555" }} />
                  </IconButton>
                ),
                disableUnderline: true,
                sx: {
                  width: "100%",
                  color: "#555555",
                  backgroundColor: "#ffffff",
                  borderRadius: "16px",
                  paddingLeft: 0,
                  paddingRight: 2,
                },
              }}
            />
            <Button
              onClick={() =>
                router.push("/admin/dashboard/auction/add-auction")
              }
              variant="contained"
              className="font-bold border-none bg-primaryColor text-white capitalize flex flex-row items-center gap-2 shadow-none"
            >
              <span>Add New Bid</span>
            </Button>
          </div>
        </div>
        <div className="flex flex-col w-full gap-6 mt-10">
          {fetchLoading ? (
            <CircularProgress />
          ) : auctions?.length ? (
            auctions.map((item, index) => {
              return (
                <div className=" relative bg-white w-full rounded-2xl p-10 flex xl:flex-row lg:flex-row md:flex-row flex-col items-center gap-6">
                  <div className="flex flex-col w-full">
                    <small>{item.title}</small>
                    <span>{item.description}</span>
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
                      <span className="">
                        {getFormattedDate(item.startDate)}
                      </span>
                    </div>
                    <div className="flex flex-col">
                      <span className="text-xs">end date</span>
                      <span className="">{getFormattedDate(item.endDate)}</span>
                    </div>
                  </div>
                  <div
                    onClick={() => {
                      setSelectedAuction(item);
                      setOpenEditDrawer(true);
                    }}
                    className="absolute cursor-pointer right-4 bottom-4 w-fit flex flex-row items-center"
                  >
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
            })
          ) : (
            <span className="text-titleColor text-xl text-center w-full h-full flex flex-row items-center justify-center">
              There are no auctions
            </span>
          )}
        </div>
      </div>
      {selectedAuction && (
        <EditAuction
          open={openEditDrawer}
          auction={selectedAuction}
          onClose={() => setOpenEditDrawer(false)}
          onRefresh={() => setRefetch(!refetch)}
        />
      )}
    </div>
  );
};

export default Auction;
