"use client";

import { Button, CircularProgress, IconButton, TextField } from "@mui/material";
import PageHeader from "../shared/PageHeader";
import { useRouter } from "next/navigation";
import { getFormattedDate } from "@/util/date";
import Image from "next/image";
import axios from "axios";
import { useEffect, useState } from "react";
import { Auction, UserRole } from "@prisma/client";
import { ArrowDropDown, SearchOutlined } from "@mui/icons-material";
import EditAuction from "./EditAuction";
import StyledMenu from "../shared/StyledMenu";
import DateRangeSelector from "../shared/DateRangeSelector";
import { useSession } from "next-auth/react";

const AuctionPage = () => {
  const session = useSession();
  const router = useRouter();
  const [refetch, setRefetch] = useState<boolean>(false);
  const [fetchLoading, setfetchLoading] = useState<boolean>(false);
  const [searchText, setSearchText] = useState<string>("");
  const [dateFilter, setDateFilter] = useState<{
    startDate: Date;
    endDate: Date;
  }>();
  const [currentPage, setCurrentPage] = useState(1);
  const [auctions, setAuctions] = useState<
    (Auction & {
      totalBidders: number;
      totalCPO: number;
      totalDocumentSales: number;
    })[]
  >();
  const [totalCount, setTotalCount] = useState<number>(0);
  const [selectedAuction, setSelectedAuction] = useState<Auction>();
  const [openEditDrawer, setOpenEditDrawer] = useState(false);
  const [dateAnchor, setDateAnchor] = useState<null | Element>(null);
  const opendate = Boolean(dateAnchor);

  const fetchAuction = async ({ pageSize }: { pageSize: number }) => {
    setfetchLoading(true);
    const result = await axios.post("/api/auction/fetch", {
      page: currentPage,
      pageSize,
      filters: {
        searchText,
        startDate: dateFilter?.startDate,
        endDate: dateFilter?.endDate,
      },
    });

    if (result.data.success) {
      setAuctions(result.data.value.auctions);
      setTotalCount(result.data.value.total);
    }
    setfetchLoading(false);
  };

  useEffect(() => {
    fetchAuction({ pageSize: 10 });
  }, [refetch, dateFilter]);

  const handleDateClose = () => {
    setDateAnchor(null);
  };

  return (
    <div className="h-full w-full overflow-y-auto">
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
      <PageHeader />
      <div className="lg:px-[40px] md:px-[40px] px-[20px] py-10 w-full flex flex-col flex-1 ">
        <div className="flex xl:lg:flex-row md:flex-row flex-col xl:lg:items-center md:items-center justify-between gap-2">
          <div className="flex flex-row items-center gap-6">
            <span className="text-titleColor font-bold text-3xl">
              Auctions List
            </span>
            <div className="min-w-[130px]">
              <div
                className="w-full border-[1px] h-[40px] border-titleColor text-titleColor p-2 relative pr-8 text-center cursor-pointer rounded-[5px]"
                defaultValue={"All time"}
                onClick={(e) => setDateAnchor(e.currentTarget)}
              >
                {dateFilter?.startDate && dateFilter?.endDate
                  ? `${getFormattedDate(
                      dateFilter?.startDate
                    )} - ${getFormattedDate(dateFilter?.endDate)}`
                  : "All Time"}
                <ArrowDropDown className="absolute right-2 top-2" />
              </div>
            </div>
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
        <div className="flex flex-col w-full gap-6 mt-10 min-h-[600px]">
          {fetchLoading ? (
            <CircularProgress />
          ) : auctions?.length ? (
            auctions.map((item, index) => {
              return (
                <div
                  key={item.id}
                  className="z-10 relative cursor-pointer bg-white w-full rounded-2xl p-10 "
                >
                  <div
                    onClick={() => {
                      router.push(`/admin/dashboard/auction/${item.id}`);
                    }}
                    className="flex xl:flex-row lg:flex-row md:flex-row flex-col items-center gap-6"
                  >
                    <div className="flex flex-col flex-1">
                      <span className="font-bold">{item.title}</span>
                      <span className="text-titleColor">
                        {item.description.slice(0, 300)}
                        {item.description.length > 300 && "..."}
                      </span>
                    </div>

                    <div className="border-l-2 pl-6 flex flex-row items-center justify-center gap-6 flex-1">
                      <div className="flex flex-col">
                        <span className="font-bold">{item.totalBidders}</span>
                        <span className="text-xs">Bidders</span>
                      </div>
                      <div className="flex flex-col">
                        <span className="font-bold">
                          {item.totalDocumentSales} ETB
                        </span>
                        <span className="text-xs">Document sales</span>
                      </div>
                      <div className="flex flex-col">
                        <span className="font-bold">{item.totalCPO} ETB</span>
                        <span className="text-xs">CPO sales</span>
                      </div>
                    </div>

                    <div className="flex flex-row items-center gap-6 justify-center flex-1">
                      <div className="flex flex-col">
                        <span className="text-xs">start date</span>
                        <span className="">
                          {getFormattedDate(item.startDate)}
                        </span>
                      </div>
                      <div className="flex flex-col">
                        <span className="text-xs">end date</span>
                        <span className="">
                          {getFormattedDate(item.endDate)}
                        </span>
                      </div>
                    </div>
                  </div>

                  {session.data?.user.role === UserRole.Owner && (
                    <div
                      onClick={() => {
                        setSelectedAuction(item);
                        setOpenEditDrawer(true);
                      }}
                      className="z-20 absolute cursor-pointer right-4 bottom-4 w-fit flex flex-row items-center"
                    >
                      <Image
                        src={"/icons/bx_edit.svg"}
                        alt=""
                        width={20}
                        height={20}
                      />
                      <small>Edit</small>
                    </div>
                  )}
                </div>
              );
            })
          ) : (
            <span className="text-titleColor text-xl text-center w-full h-full flex flex-row items-center justify-center">
              There are no auctions
            </span>
          )}
        </div>
        <div className="flex flex-row justify-end items-center gap-6">
          <Button
            variant="outlined"
            className="cursor-pointer"
            style={{ border: "none" }}
            disabled={currentPage <= 1}
            onClick={() => {
              setCurrentPage(currentPage - 1);
            }}
          >
            Previous
          </Button>
          <Button
            variant="outlined"
            className="cursor-pointer"
            style={{ border: "none" }}
            disabled={Math.ceil(totalCount / 10) <= 1}
            onClick={() => {
              if (currentPage < Math.ceil(totalCount / 10)) {
                setCurrentPage(currentPage + 1);
              }
            }}
          >
            Next
          </Button>
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

export default AuctionPage;
