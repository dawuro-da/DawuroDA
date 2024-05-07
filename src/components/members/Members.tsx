"use client";

import {
  Avatar,
  Button,
  IconButton,
  MenuItem,
  Select,
  TextField,
} from "@mui/material";
import PageHeader from "../shared/PageHeader";
import Image from "next/image";
import CustomizedDatagrid from "../shared/CustomizedDatagrid";
import { useEffect, useState } from "react";
import axios from "axios";
import { GridColDef } from "@mui/x-data-grid";
import { getFormattedDateFromTimestamp } from "@/util/date";
import { useRouter } from "next/navigation";
import { Close, SearchOutlined } from "@mui/icons-material";

const Members = () => {
  const router = useRouter();
  const [searchValue, setSearchValue] = useState<string>("");
  const [members, setMembers] = useState<any[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [isSmScreen, setIsSmScreen] = useState<boolean>(false);

  const fetchMembers = async () => {
    setLoading(true);
    const result = await axios.get("/api/member/fetch");
    if (result.data.success) {
      setMembers(result.data.value);
    }
    setLoading(false);
  };

  useEffect(() => {
    // fetchMembers();
    if (window.innerWidth < 900) {
      setIsSmScreen(true);
    }
  }, []);

  const onConfirm = async (customer: any) => {};

  return (
    <div className="h-full w-full overflow-y-auto">
      <PageHeader />
      <div className="px-[40px] py-10 w-full flex flex-col flex-1 ">
        <div className="flex flex-row items-center justify-between">
          <span className="text-titleColor font-bold text-3xl">
            Members List
          </span>
          <div className="flex flex-row items-center gap-6">
            <div className="w-[130px]">
              <Select className="w-full" defaultValue={"All time"} size="small">
                <MenuItem value="All time">All time</MenuItem>
                <MenuItem value="last 7 day">last 7 days</MenuItem>
                <MenuItem value="last month">last month</MenuItem>
              </Select>
            </div>
            <Button
              variant="contained"
              className="border-none bg-primaryColor text-white capitalize flex flex-row items-center gap-2 shadow-none"
            >
              <span>Add Member</span>
              <Image
                src={"/icons/plusIcon.svg"}
                alt=""
                width={28}
                height={28}
              />
            </Button>
          </div>
        </div>
        <div className="mt-10 w-full flex flex-col gap-2">
          <small className="text-[#B3B3B3]">Filter by:</small>
          <div className="flex flex-row items-center justify-between w-full">
            <div className="grid xl:grid-cols-4 lg:grid-cols-4 md:grid-cols-2 gap-2">
              <div className="w-[190px] bg-white">
                <Select
                  className="w-full"
                  defaultValue={"membership-level"}
                  size="small"
                  sx={selectStyle}
                >
                  <MenuItem value="membership-level">Membership Level</MenuItem>
                  <MenuItem value="last 7 day">last 7 days</MenuItem>
                  <MenuItem value="last month">last month</MenuItem>
                </Select>
              </div>
              <div className="w-[190px] bg-white">
                <Select
                  className="w-full border-none"
                  defaultValue={"contribution-system"}
                  size="small"
                  sx={selectStyle}
                >
                  <MenuItem value="contribution-system">
                    Constribution System
                  </MenuItem>
                  <MenuItem value="last 7 day">last 7 days</MenuItem>
                  <MenuItem value="last month">last month</MenuItem>
                </Select>
              </div>
              <div className="w-[190px] bg-white">
                <Select
                  className="w-full border-none"
                  defaultValue={"membership-type"}
                  size="small"
                  sx={selectStyle}
                >
                  <MenuItem value="membership-type">Membership Type</MenuItem>
                  <MenuItem value="last 7 day">last 7 days</MenuItem>
                  <MenuItem value="last month">last month</MenuItem>
                </Select>
              </div>
              <div className="w-[190px] bg-white">
                <Select
                  className="w-full border-none"
                  defaultValue={"payment-status"}
                  size="small"
                  sx={selectStyle}
                >
                  <MenuItem value="payment-status">Payment Status</MenuItem>
                  <MenuItem value="last 7 day">last 7 days</MenuItem>
                  <MenuItem value="last month">last month</MenuItem>
                </Select>
              </div>
            </div>
            <div>
              <TextField
                fullWidth
                id="navbar-searchfield"
                size="small"
                name="searchText"
                variant="filled"
                value={searchValue}
                onChange={(e) => setSearchValue(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === "Enter") {
                    console.log(e);
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
          <div className="border-b-[1px] flex-1 border-b-titleColor opacity-25 mt-2" />
          <small className="text-[#B3B3B3]">Applied filters:</small>
          <div className="flex flex-row gap-2 italic text-[#555555]">
            <small className="bg-white px-4 py-1 w-fit flex flex-row items-center gap-2">
              <Close style={{ height: "80%" }} />
              <span>
                Premium Members: <strong>120</strong>
              </span>
            </small>
            <small className="bg-white px-4 py-1 w-fit flex flex-row items-center gap-2">
              <Close style={{ height: "80%" }} />
              <span>
                Monthly Contributors: <strong>120</strong>
              </span>
            </small>
            <small className="bg-white px-4 py-1 w-fit flex flex-row items-center gap-2">
              <Close style={{ height: "80%" }} />
              <span>
                Corporate Members: <strong>120</strong>
              </span>
            </small>
            <small className="bg-white px-4 py-1 w-fit flex flex-row items-center gap-2">
              <Close style={{ height: "80%" }} />
              <span>
                Search: <strong>Chino Yala</strong>
              </span>
            </small>
          </div>
        </div>
        <div className="mt-10 w-full h-[510px]">
          <CustomizedDatagrid
            columns={getColumnDefinition({ onConfirm, isSmScreen: isSmScreen })}
            rows={rows ?? []}
            loading={false}
            onRowClick={() => {}}
            totalCount={10}
            onPageChange={() => {}}
          />
        </div>
      </div>
    </div>
  );
};

export default Members;

const getColumnDefinition = ({
  onConfirm,
  isSmScreen,
}: {
  onConfirm: (customer: any) => Promise<void>;
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
                <Avatar sizes="small" src="" />
                <span>{params.value}</span>
              </span>
            );
          },
        },
        {
          field: "memberLevel",
          headerName: "Member Level",
          flex: 1,
          minWidth: 110,
          headerAlign: "center",
          renderCell: (params) => {
            return (
              <div className="flex flex-row items-center gap-2 justify-center h-full">
                <span
                  className={`flex flex-row items-center justify-center w-fit ${
                    params.value === "Gold"
                      ? "bg-green-500"
                      : params.value === "Silver"
                      ? "bg-slate-500"
                      : "bg-red-950"
                  } text-white rounded-[8px] min-w-20 text-center px-4 h-8 `}
                >
                  {params.value}
                </span>
              </div>
            );
          },
        },
        {
          field: "hasPaid",
          headerName: "Paid",
          flex: 1,
          minWidth: 110,
          headerAlign: "center",
          renderCell: (params) => {
            return (
              <div className="flex flex-row items-center gap-2 justify-center h-full">
                <span
                  className={`flex flex-row items-center justify-center w-fit ${
                    params.value === "Paid" ? "bg-[#34A858B2]" : "bg-red-200"
                  } text-white rounded-[8px] min-w-20 text-center px-4 h-8 `}
                >
                  {params.value}
                </span>
              </div>
            );
          },
        },

        {
          field: "timestamp",
          headerName: "Timestamp",
          flex: 1,
          minWidth: 110,
          renderCell: (params) => {
            return <span>{getFormattedDateFromTimestamp(params.value)}</span>;
          },
        },
        {
          field: "action",
          headerName: "Actions",
          flex: 1,
          align: "center",
          maxWidth: 80,
          minWidth: 80,
          renderCell: (params) => {
            return (
              <div className="flex flex-row h-full w-full justify-center">
                <span
                  className="rotate-90 font-bold cursor-pointer hover:scale-125"
                  onClick={() => {}}
                >
                  ...
                </span>
              </div>
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
          headerAlign: "center",
          renderCell: (params) => {
            return (
              <span className="flex flex-row items-center gap-2 ">
                <Avatar sizes="small" src="" />
                <span>{params.value}</span>
              </span>
            );
          },
        },
        {
          field: "hasPaid",
          headerName: "Paid",
          flex: 1,
          minWidth: 110,
          renderCell: (params) => {
            return (
              <span className="flex flex-row items-center gap-2">
                <span className="w-fit bg-[#34A858B2] text-white rounded-[8px] min-w-12 text-center h-fit">
                  {params.value}
                </span>
              </span>
            );
          },
        },
        {
          field: "action",
          headerName: "Actions",
          flex: 1,
          align: "center",
          maxWidth: 80,
          minWidth: 80,
          renderCell: (params) => {
            return (
              <div className="flex flex-row h-full w-full justify-center">
                <span
                  className="rotate-90 font-bold cursor-pointer hover:scale-125"
                  onClick={() => {}}
                >
                  ...
                </span>
              </div>
            );
          },
        },
      ];

const rows = [
  {
    id: 1,
    memberId: 1001,
    fullName: "John Doe",
    memberLevel: "Gold",
    hasPaid: "Paid",
    timestamp: "2023-12-25T12:30:00Z",
  },
  {
    id: 2,
    memberId: 1002,
    fullName: "Jane Smith",
    memberLevel: "Silver",
    hasPaid: "Unpaid",
    timestamp: "2023-12-26T09:45:00Z",
  },
  {
    id: 3,
    memberId: 1003,
    fullName: "Michael Johnson",
    memberLevel: "Gold",
    hasPaid: "Paid",
    timestamp: "2023-12-27T15:20:00Z",
  },
  {
    id: 4,
    memberId: 1004,
    fullName: "Emily Wilson",
    memberLevel: "Bronze",
    hasPaid: "Paid",
    timestamp: "2023-12-28T11:10:00Z",
  },
  {
    id: 5,
    memberId: 1005,
    fullName: "David Brown",
    memberLevel: "Silver",
    hasPaid: "Unpaid",
    timestamp: "2023-12-29T14:55:00Z",
  },
  {
    id: 6,
    memberId: 1006,
    fullName: "Olivia Martinez",
    memberLevel: "Gold",
    hasPaid: "Paid",
    timestamp: "2023-12-30T17:40:00Z",
  },
  {
    id: 7,
    memberId: 1007,
    fullName: "William Rodriguez",
    memberLevel: "Gold",
    hasPaid: "Paid",
    timestamp: "2023-12-31T10:25:00Z",
  },
  {
    id: 8,
    memberId: 1008,
    fullName: "Emma Taylor",
    memberLevel: "Silver",
    hasPaid: "Unpaid",
    timestamp: "2024-01-01T13:15:00Z",
  },
  {
    id: 9,
    memberId: 1009,
    fullName: "James Wilson",
    memberLevel: "Gold",
    hasPaid: "Paid",
    timestamp: "2024-01-02T16:05:00Z",
  },
  {
    id: 10,
    memberId: 1010,
    fullName: "Sophia Brown",
    memberLevel: "Bronze",
    hasPaid: "Unpaid",
    timestamp: "2024-01-03T19:00:00Z",
  },
];

const selectStyle = {
  ".MuiOutlinedInput-notchedOutline": {
    border: 0,
  },
};
