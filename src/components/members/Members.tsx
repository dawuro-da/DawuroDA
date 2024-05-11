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
import { Member, MembershipLevel } from "@prisma/client";
import StyledMenu from "../shared/StyledMenu";
import { useSession } from "next-auth/react";

const Members = () => {
  const router = useRouter();
  const session = useSession();
  const [searchValue, setSearchValue] = useState<string>("");
  const [members, setMembers] = useState<any[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [isSmScreen, setIsSmScreen] = useState<boolean>(false);
  const [selectedMember, setSelecterdMember] = useState<Member>();
  const [anchorEl, setAnchorEl] = useState<null | Element>(null);
  const open = Boolean(anchorEl);

  const handleClose = () => {
    setAnchorEl(null);
  };

  const fetchMembers = async () => {
    setLoading(true);
    const result = await axios.get("/api/member/fetch");
    if (result.data.success) {
      setMembers(result.data.value);
    }
    setLoading(false);
  };

  useEffect(() => {
    fetchMembers();
    if (window.innerWidth < 900) {
      setIsSmScreen(true);
    }
  }, []);

  const onOption = async (customer: any, e: any) => {
    setAnchorEl(e.currentTarget);
    setSelecterdMember(customer);
  };

  return (
    <>
      <StyledMenu anchorEl={anchorEl} open={open} onClose={handleClose}>
        <div>
          <MenuItem
            onClick={() => {
              console.log({ selectedMember });
              if (
                selectedMember &&
                session?.data?.user.id === selectedMember?.registeredBy
              ) {
                router.push(`/admin/dashboard/members/${selectedMember.id}`);
              }
            }}
          >
            Edit
          </MenuItem>
          <MenuItem onClick={() => {}}>Delete</MenuItem>
        </div>
      </StyledMenu>
      <div className="h-full w-full overflow-y-auto">
        <PageHeader />
        <div className="lg:px-[40px] md:px-[40px] px-[20px] py-10 w-full flex flex-col flex-1 ">
          <div className="flex xl:lg:flex-row md:flex-row flex-col xl:lg:items-center md:items-center justify-between gap-2">
            <span className="text-titleColor font-bold text-3xl">
              Members List
            </span>
            <div className="flex flex-row items-center gap-6">
              <div className="w-[130px]">
                <Select
                  className="w-full"
                  defaultValue={"All time"}
                  size="small"
                >
                  <MenuItem value="All time">All time</MenuItem>
                  <MenuItem value="last 7 day">last 7 days</MenuItem>
                  <MenuItem value="last month">last month</MenuItem>
                </Select>
              </div>
              <Button
                onClick={() =>
                  router.push("/admin/dashboard/members/add-member")
                }
                variant="contained"
                className=" font-bold border-none bg-primaryColor text-white capitalize flex flex-row items-center gap-2 shadow-none"
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
            <div className="flex xl:lg:flex-row md:flex-row flex-col items-center xl:lg:justify-between md:justify-between w-full">
              <div className="grid xl:grid-cols-4 lg:grid-cols-4 md:grid-cols-2  gap-2">
                <div className="w-[190px] bg-white">
                  <Select
                    className="w-full"
                    defaultValue={"membership-level"}
                    size="small"
                    sx={selectStyle}
                  >
                    <MenuItem value="membership-level">
                      Membership Level
                    </MenuItem>
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
              <div className="xl:lg:md:mt-0 mt-2">
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
            <div className="xl:flex xl:flex-row lg:flex lg:flex-row md:flex md:flex-row grid grid-cols-2 gap-2 italic text-[#555555]">
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
              columns={getColumnDefinition({
                onOption,
                isSmScreen: isSmScreen,
              })}
              rows={members ?? []}
              loading={loading}
              onRowClick={() => {}}
              totalCount={10}
              onPageChange={() => {}}
            />
          </div>
        </div>
      </div>
    </>
  );
};

export default Members;

const getColumnDefinition = ({
  onOption,
  isSmScreen,
}: {
  onOption: (customer: any, e: any) => Promise<void>;
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
          field: "firstName",
          headerName: "Full Name",
          flex: 1,
          minWidth: 110,

          renderCell: (params) => {
            return (
              <span className="flex flex-row items-center gap-2 ">
                <Avatar sizes="small" src="" />
                <span>
                  {params.row.firstName} {params.row.lastName}
                </span>
              </span>
            );
          },
        },
        {
          field: "membershipLevel",
          headerName: "Membership Level",
          flex: 1,
          minWidth: 110,
          headerAlign: "center",
          renderCell: (params) => {
            return (
              <div className="flex flex-row items-center gap-2 justify-center h-full">
                <span
                  className={`flex flex-row items-center justify-center w-fit ${
                    params.value === MembershipLevel.Premium
                      ? "bg-green-500"
                      : params.value === MembershipLevel.Diamond
                      ? "bg-indigo-400"
                      : params.value === MembershipLevel.Gold
                      ? "bg-orange-400"
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
                    params.value ? "bg-[#34A858B2]" : "bg-red-200"
                  } text-white rounded-[8px] min-w-20 text-center px-4 h-8 `}
                >
                  {params.value ? "Paid" : "Unpaid"}
                </span>
              </div>
            );
          },
        },

        {
          field: "lastPaidAt",
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
          maxWidth: 120,
          minWidth: 120,
          renderCell: (params) => {
            return (
              <div className="flex flex-row h-full w-full justify-center">
                <span
                  className="rotate-90 font-bold cursor-pointer hover:scale-125"
                  onClick={(e) => {
                    e.isPropagationStopped();
                    onOption(params.row, e);
                  }}
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
          field: "memberId",
          headerName: "MemberId",
          flex: 1,
          minWidth: 110,
          align: "center",
          headerAlign: "center",
        },
        {
          field: "firstName",
          headerName: "Full Name",
          flex: 1,
          minWidth: 110,

          renderCell: (params) => {
            return (
              <span className="flex flex-row items-center gap-2 ">
                <Avatar sizes="small" src="" />
                <span>
                  {params.row.firstName} {params.row.lastName}
                </span>
              </span>
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
                    params.value ? "bg-[#34A858B2]" : "bg-red-200"
                  } text-white rounded-[8px] min-w-20 text-center px-4 h-8 `}
                >
                  {params.value ? "Paid" : "Unpaid"}
                </span>
              </div>
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

const selectStyle = {
  ".MuiOutlinedInput-notchedOutline": {
    border: 0,
  },
  color: "#555555",
};
