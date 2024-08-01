"use client";

import { ArrowBack } from "@mui/icons-material";
import { useRouter } from "next/navigation";
import PageHeader from "../shared/PageHeader";
import { Auction, Bidder } from "@prisma/client";
import { PageState } from "../shared/CustomizedDatagrid";
import { Avatar, Button } from "@mui/material";
import { GridColDef } from "@mui/x-data-grid";
import { useEffect, useState } from "react";
import axios from "axios";
import { showToastAction } from "@/redux/actions";
import { useDispatch } from "react-redux";
import AuctionDataGrid from "./AuctionDatagrid";

const AuctionDetail = ({ auction }: { auction: Auction | null }) => {
  const router = useRouter();
  const dispatch = useDispatch();
  const [isSmScreen, setIsSmScreen] = useState<boolean>(false);
  const [loading, setLoading] = useState<boolean>(false);
  const [bidders, setBidders] = useState<Bidder[]>([]);
  const [totalCount, setTotalCount] = useState<number>(0);

  const fetchBidders = async ({ page, pageSize }: PageState) => {
    setLoading(true);
    const result = await axios.post("/api/auction/bidders", {
      page,
      pageSize,
      auctionId: auction?.id,
    });

    if (result.data.success) {
      setBidders(result.data.value.bidders);
      setTotalCount(result.data.value.total);
    } else {
      dispatch(showToastAction({ message: result.data.error, type: "error" }));
    }
    setLoading(false);
  };

  const onDownload = async (bidder: Bidder) => {};

  const onPageChange = async ({ page, pageSize }: PageState) => {
    await fetchBidders({ page, pageSize: 10 });
  };

  // Assuming auction?.endDate is a string representation of a date
  const auctionEndDate = new Date(auction?.endDate ?? "");
  const currentDate = new Date();

  // Normalize both dates to the start of the day (00:00:00)
  auctionEndDate.setHours(0, 0, 0, 0);
  currentDate.setHours(0, 0, 0, 0);

  useEffect(() => {
    if (window.innerWidth < 900) {
      setIsSmScreen(true);
    }
    if (auctionEndDate.getTime() === currentDate.getTime()) {
      fetchBidders({ page: 1, pageSize: 10 });
    }
  }, []);

  return (
    <div className="h-full w-full overflow-y-auto text-titleColor">
      <PageHeader />
      <div className="lg:px-[40px] md:px-[40px] px-[20px] py-10 w-full flex flex-col flex-1 ">
        <div className="flex xl:lg:flex-row md:flex-row flex-col xl:lg:items-center md:items-center justify-between gap-2">
          <div
            onClick={() => {
              router.push("/admin/dashboard/auction");
            }}
            className="flex flex-row items-center gap-2 cursor-pointer"
          >
            <ArrowBack />
            <span className="text-titleColor text-sm">Back to Auctions</span>
          </div>
        </div>
      </div>
      <div className="lg:px-[40px] md:px-[40px] px-[20px] flex-1 flex flex-col gap-6">
        <span className="text-3xl text-titleColor font-bold max-w-[500px]">
          {auction?.title}
        </span>
        <span className="text-titleColor max-w-[600px]">
          {auction?.description}
        </span>
        <div className=" flex flex-row items-center gap-6 w-full">
          <div className="flex flex-col">
            <span className="font-bold">64</span>
            <span className="text-xs">Bidders</span>
          </div>
          <div className="flex flex-col">
            <span className="font-bold">4,400 ETB</span>
            <span className="text-xs">Document sales</span>
          </div>
          <div className="flex flex-col">
            <span className="font-bold">4,400 ETB</span>
            <span className="text-xs">Revenue from CPO sales</span>
          </div>
        </div>
        <span className="text-titleColor border-y-2 w-full py-6 mt-6">
          Bidders List
        </span>
        {auctionEndDate.getTime() === currentDate.getTime() && (
          <div className="h-[510px] -mt-10">
            <AuctionDataGrid
              columns={getColumnDefinition({ onDownload, isSmScreen })}
              rows={bidders}
              onPageChange={onPageChange}
              loading={loading}
              totalCount={totalCount}
            />
          </div>
        )}
      </div>
    </div>
  );
};
export default AuctionDetail;

const getColumnDefinition = ({
  onDownload,
  isSmScreen,
}: {
  onDownload: (customer: any) => Promise<void>;
  isSmScreen: boolean;
}): GridColDef[] =>
  !isSmScreen
    ? [
        {
          field: "memberId",
          headerName: "MemberId",
          flex: 1,
          minWidth: 110,
          align: "center",
          headerAlign: "center",
        },
        {
          field: "fullName",
          headerName: "Full Name",
          flex: 1,
          minWidth: 110,

          renderCell: (params) => {
            return (
              <span className="flex flex-row items-center gap-2 ">
                <Avatar sizes="small" src={params.row.profileImage} />
                {params.row.fullName && <span>{params.row.fullName}</span>}
                {params.row.institutionName && (
                  <span>{params.row.institutionName}</span>
                )}
              </span>
            );
          },
        },
        {
          field: "offer",
          headerName: "Offer",
          flex: 1,
          minWidth: 110,

          renderCell: (params) => {
            return (
              <span className="flex flex-row items-center gap-2 ">
                <span>{params.row.offer}</span>
              </span>
            );
          },
        },
        {
          field: "filledForm",
          headerName: "Document",
          flex: 1,
          minWidth: 110,

          renderCell: (params) => {
            return (
              <Button
                variant="outlined"
                size="small"
                className="px-2 flex flex-row capitalize items-center gap-2 "
              >
                Download
              </Button>
            );
          },
        },
      ]
    : [
        {
          field: "fullName",
          headerName: "Full Name",
          flex: 1,
          minWidth: 110,

          renderCell: (params) => {
            return (
              <span className="flex flex-row items-center gap-2 ">
                <Avatar sizes="small" src={params.row.profileImage} />
                {params.row.fullName && <span>{params.row.fullName}</span>}
                {params.row.institutionName && (
                  <span>{params.row.institutionName}</span>
                )}
              </span>
            );
          },
        },
        {
          field: "offer",
          headerName: "Offer",
          flex: 1,
          minWidth: 110,

          renderCell: (params) => {
            return (
              <span className="flex flex-row items-center gap-2 ">
                <span>{params.row.offer}</span>
              </span>
            );
          },
        },
        {
          field: "filledForm",
          headerName: "Document",
          flex: 1,
          minWidth: 110,

          renderCell: (params) => {
            return (
              <Button
                variant="outlined"
                size="small"
                className="px-2 flex flex-row capitalize items-center gap-2 "
              >
                Download
              </Button>
            );
          },
        },
      ];

const selectStyle = {
  ".MuiOutlinedInput-notchedOutline": {
    border: 0,
  },
  color: "#555555",
};
