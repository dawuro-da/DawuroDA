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
import CustomizedDatagrid, { PageState } from "../shared/CustomizedDatagrid";
import { useEffect, useState } from "react";
import axios from "axios";
import { GridColDef } from "@mui/x-data-grid";
import { getFormattedDate, getFormattedDateFromTimestamp } from "@/util/date";
import { useRouter } from "next/navigation";
import { ArrowDropDown, SearchOutlined } from "@mui/icons-material";
import {
  ContributionSystem,
  Member,
  MembershipType,
  PaymentMeans,
  UserRole,
} from "@prisma/client";
import { useMembershipLevels } from "@/util/useMembershipLevels";
import StyledMenu from "../shared/StyledMenu";
import { useSession } from "next-auth/react";
import MemberDetail from "./MemberDetail";
import DateRangeSelector from "../shared/DateRangeSelector";
import DeleteModal from "../shared/DeleteModal";
import { showToastAction } from "@/redux/actions";
import { useDispatch } from "react-redux";
import { downloadExcel } from "@/util/helper";
import { Session } from "next-auth";
import { Dawuro_Branches } from "@/constants/datas";

const Members = () => {
  const dispatch = useDispatch();
  const router = useRouter();
  const session = useSession();
  const { levels } = useMembershipLevels();
  const [searchText, setSearchText] = useState<string>("");
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);
  const [members, setMembers] = useState<any[]>([]);
  const [filters, setFilters] = useState({
    membershipLevel: "",
    contributionSystem: "",
    membershipType: "",
    paymentStatus: "",
    branch: "",
  });
  const [generateLoading, setGenerateLoading] = useState(false);
  const [loading, setLoading] = useState<boolean>(false);
  const [isSmScreen, setIsSmScreen] = useState<boolean>(false);
  const [selectedMember, setSelectedMember] = useState<Member>();
  const [showDetailDrawer, setShowDetailDrawer] = useState<boolean>(false);
  const [searching, setSearching] = useState<boolean>(false);
  const [anchorEl, setAnchorEl] = useState<null | Element>(null);
  const [totalCount, setTotalCount] = useState(0);
  const [refresh, setRefresh] = useState<boolean>(false);
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

  const fetchMembers = async ({ page, pageSize }: PageState) => {
    setLoading(true);
    const result = await axios.post("/api/member/fetch", {
      page,
      pageSize,
      filters: {
        ...filters,
        startDate: dateFilter?.startDate,
        endDate: dateFilter?.endDate,
      },
      searchText,
    });

    if (result.data.success) {
      setMembers(result.data.value.members);
      setTotalCount(result.data.value.total);
    } else {
      dispatch(showToastAction({ message: result.data.error, type: "error" }));
    }
    setLoading(false);
  };

  useEffect(() => {
    fetchMembers({ page: 1, pageSize: 5 });
  }, [filters, searching, refresh, dateFilter]);

  useEffect(() => {
    if (window.innerWidth < 900) {
      setIsSmScreen(true);
    }
  }, []);

  const onOption = async (customer: any, e: any) => {
    setAnchorEl(e.currentTarget);
    setSelectedMember(customer);
  };

  const onRowClick = (data: Member) => {
    setShowDetailDrawer(true);
    setSelectedMember(data);
  };

  const onCloseDrawer = () => {
    setShowDetailDrawer(false);
  };

  const onPageChange = async ({ page, pageSize }: PageState) => {
    await fetchMembers({ page, pageSize });
  };

  const onRefresh = () => {
    setRefresh(!refresh);
  };

  const handleDateClose = () => {
    setDateAnchor(null);
  };

  const handleDelete = async (id?: string) => {
    try {
      const res = await axios.delete(`/api/member/delete/${id}`);

      if (res?.status === 200) {
        dispatch(
          showToastAction({
            message: "Successfully Deleted",
            type: "success",
          })
        );
        setAnchorEl(null);
        setSelectedMember(undefined);
        setRefresh(!refresh);
      }
    } catch (err: any) {
      console.error(err);
      dispatch(
        showToastAction({
          message: err?.response?.data?.error ?? "something went wrong",
          type: "error",
        })
      );
    }
  };

  const generateMemberReport = async () => {
    setGenerateLoading(true);
    const result = await axios.post("/api/member/fetch/all", {
      filters: {
        ...filters,
        startDate: dateFilter?.startDate,
        endDate: dateFilter?.endDate,
      },
      searchText,
    });

    if (result.data.success) {
      downloadExcel(result.data.value.members, "MembersReport");
      dispatch(
        showToastAction({ message: "Successfully generated", type: "success" })
      );
    } else {
      dispatch(showToastAction({ message: result.data.error, type: "error" }));
    }
    setGenerateLoading(false);
  };

  return (
    <>
      <StyledMenu anchorEl={anchorEl} open={open} onClose={handleClose}>
        <div>
          <MenuItem
            onClick={() => {
              router.push(`/admin/dashboard/members/${selectedMember?.id}`);
            }}
          >
            Edit
          </MenuItem>
          <MenuItem
            onClick={() => {
              setShowDeleteDialog(true);
            }}
          >
            Delete
          </MenuItem>
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

      {selectedMember && (
        <MemberDetail
          member={selectedMember}
          open={showDetailDrawer}
          onClose={onCloseDrawer}
          onRefresh={onRefresh}
        />
      )}

      <div className="h-full w-full overflow-y-auto">
        <PageHeader />
        <div className="lg:px-[40px] md:px-[40px] px-[20px] py-10 w-full flex flex-col flex-1 ">
          <div className="flex xl:lg:flex-row md:flex-row flex-col xl:lg:items-center md:items-center justify-between gap-2">
            <div className="flex flex-row items-center gap-6">
              <span className="text-titleColor font-bold text-3xl">
                Members List
              </span>
              <div className="xl:lg:md:mt-0 mt-2">
                <TextField
                  fullWidth
                  id="navbar-searchfield"
                  size="small"
                  name="searchText"
                  variant="filled"
                  value={searchText}
                  onChange={(e) => {
                    if (e.target.value === "") {
                      setSearching(!searching);
                    }
                    setSearchText(e.target.value);
                  }}
                  onKeyDown={(e) => {
                    if (e.key === "Enter") {
                      setSearching(!searching);
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
                          setSearching(!searching);
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
            <div className="flex flex-row items-center gap-6">
              <div className="min-w-[130px]">
                <div
                  className="w-full border-[1px] h-full border-titleColor text-titleColor p-2 relative pr-8 text-center cursor-pointer rounded-[5px]"
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
              <div className="grid xl:grid-cols-5 lg:grid-cols-5 md:grid-cols-2  gap-2">
                <div className="w-[190px] bg-white">
                  <Select
                    className="w-full"
                    defaultValue={" "}
                    size="small"
                    sx={selectStyle}
                    onChange={(e) => {
                      setFilters((prev) => ({
                        ...prev,
                        membershipLevel:
                          e.target.value !== " " ? e.target.value : "",
                      }));
                    }}
                  >
                    <MenuItem value=" ">Membership Level</MenuItem>
                    {levels.map((level) => (
                      <MenuItem key={level.id} value={level.name}>
                        {level.name}
                      </MenuItem>
                    ))}
                  </Select>
                </div>
                <div className="w-[190px] bg-white">
                  <Select
                    className="w-full border-none"
                    defaultValue={" "}
                    size="small"
                    sx={selectStyle}
                    onChange={(e) => {
                      setFilters((prev) => ({
                        ...prev,
                        contributionSystem:
                          e.target.value !== " " ? e.target.value : "",
                      }));
                    }}
                  >
                    <MenuItem value=" ">Contribution System</MenuItem>
                    <MenuItem value={ContributionSystem?.Yearly}>
                      {ContributionSystem?.Yearly}
                    </MenuItem>
                    <MenuItem value={ContributionSystem?.Quarterly}>
                      {ContributionSystem?.Quarterly}
                    </MenuItem>
                    <MenuItem value={ContributionSystem?.Monthly}>
                      {ContributionSystem?.Monthly}
                    </MenuItem>
                  </Select>
                </div>
                <div className="w-[190px] bg-white">
                  <Select
                    className="w-full border-none"
                    defaultValue={" "}
                    size="small"
                    sx={selectStyle}
                    onChange={(e) => {
                      setFilters((prev) => ({
                        ...prev,
                        membershipType:
                          e.target.value !== " " ? e.target.value : "",
                      }));
                    }}
                  >
                    <MenuItem value=" ">Membership Type</MenuItem>
                    <MenuItem value={MembershipType.Individual}>
                      {MembershipType.Individual}
                    </MenuItem>
                    <MenuItem value={MembershipType.Company}>
                      {MembershipType.Company}
                    </MenuItem>
                  </Select>
                </div>
                <div className="w-[190px] bg-white">
                  <Select
                    className="w-full border-none"
                    defaultValue={" "}
                    size="small"
                    sx={selectStyle}
                    onChange={(e) => {
                      setFilters((prev) => ({
                        ...prev,
                        paymentStatus:
                          e.target.value !== " " ? e.target.value : "",
                      }));
                    }}
                  >
                    <MenuItem value=" ">Payment Status</MenuItem>
                    <MenuItem value={"paid"}>Paid</MenuItem>
                    <MenuItem value={"notPaid"}>notPaid</MenuItem>
                  </Select>
                </div>
                <div className="w-[190px] bg-white">
                  <Select
                    className="w-full border-none"
                    defaultValue={" "}
                    size="small"
                    sx={selectStyle}
                    onChange={(e) => {
                      setFilters((prev) => ({
                        ...prev,
                        paymentMeans:
                          e.target.value !== " " ? e.target.value : "",
                      }));
                    }}
                  >
                    <MenuItem value=" ">Payment Means</MenuItem>
                    <MenuItem value={PaymentMeans.Office}>
                      {PaymentMeans.Office}
                    </MenuItem>
                    <MenuItem value={PaymentMeans.Edir}>
                      {PaymentMeans.Edir}
                    </MenuItem>
                    <MenuItem value={PaymentMeans.Bank}>
                      {PaymentMeans.Bank}
                    </MenuItem>
                    <MenuItem value={PaymentMeans.Kebele}>
                      {PaymentMeans.Kebele}
                    </MenuItem>
                    <MenuItem value={PaymentMeans.Personal}>
                      {PaymentMeans.Personal}
                    </MenuItem>
                    <MenuItem value={PaymentMeans.Other}>
                      {PaymentMeans.Other}
                    </MenuItem>
                  </Select>
                </div>
                <div className="w-[190px] bg-white">
                  <Select
                    className="w-full border-none"
                    defaultValue={" "}
                    size="small"
                    sx={selectStyle}
                    onChange={(e) => {
                      setFilters((prev) => ({
                        ...prev,
                        branch: e.target.value !== " " ? e.target.value : "",
                      }));
                    }}
                  >
                    <MenuItem value=" ">branch</MenuItem>
                    {Dawuro_Branches.map((item, index) => {
                      return (
                        <MenuItem key={index} value={item}>
                          {item}
                        </MenuItem>
                      );
                    })}
                  </Select>
                </div>
              </div>
            </div>
            <div className="border-b-[1px] flex-1 border-b-titleColor opacity-25 mt-2" />
            <div className="flex flex-row gap-4 text-[#555555]">
              <small className="text-[#B3B3B3]">Total Count:</small>
              <small>
                <strong>{totalCount}</strong>
              </small>
            </div>
          </div>
          <div className="mt-10 w-full h-[510px]">
            <CustomizedDatagrid
              columns={getColumnDefinition({
                onOption,
                isSmScreen: isSmScreen,
                user: session?.data?.user,
              })}
              generateReport={generateMemberReport}
              generateLoading={generateLoading}
              rows={members ?? []}
              loading={loading}
              onRowClick={onRowClick}
              totalCount={totalCount}
              onPageChange={onPageChange}
            />
          </div>
        </div>
      </div>
      {selectedMember && (
        <DeleteModal
          open={showDeleteDialog}
          onClose={() => setShowDeleteDialog(false)}
          itemName="member"
          nameTobeDeleted={`${
            selectedMember?.firstName
              ? selectedMember?.firstName + " " + selectedMember?.lastName
              : selectedMember?.institutionName
          } `}
          onRemove={async () => {
            await handleDelete(selectedMember?.id);
          }}
        />
      )}
    </>
  );
};

export default Members;

const getColumnDefinition = ({
  onOption,
  isSmScreen,
  user,
}: {
  onOption: (customer: any, e: any) => Promise<void>;
  isSmScreen: boolean;
  user?: {
    id: string;
    firstName: string;
    lastName: string;
    role: UserRole;
    email: string;
    phone: string;
  };
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
                <Avatar sizes="small" src={params.row.profileImage} />
                {params.row.firstName && (
                  <span>
                    {params.row.firstName} {params.row.lastName}
                  </span>
                )}
                {params.row.institutionName && (
                  <span>{params.row.institutionName}</span>
                )}
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
                  className={`flex  flex-row items-center justify-center w-fit ${
                    params.value === "Platinum"
                      ? "bg-[#34A8A8] text-white"
                      : params.value === "Diamond"
                      ? "bg-[#B0E0E62E] text-titleColor"
                      : params.value === "Gold"
                      ? "bg-[#FFD7002E]"
                      : params.value === "Silver"
                      ? "bg-[#C0C0C02E]"
                      : "bg-transparent"
                  }  rounded-[8px] min-w-20 text-center px-4 h-8 `}
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
                    params.value
                      ? "bg-[#34A858B2]"
                      : "bg-[#C83A272E] text-black"
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
              <div className="flex flex-row h-full w-full justify-center z-50">
                <span
                  className="rotate-90 font-bold cursor-pointer hover:scale-125 text-[20px]"
                  onClick={(e) => {
                    e.stopPropagation();
                    if (
                      user?.role === "Owner" ||
                      user?.id === params.row.registeredBy
                    ) {
                      onOption(params.row, e);
                    }
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
                <Avatar sizes="small" src={params.row.profileImage} />
                {params.row.firstName && (
                  <span>
                    {params.row.firstName} {params.row.lastName}
                  </span>
                )}
                {params.row.institutionName && (
                  <span>{params.row.institutionName}</span>
                )}
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
                    params.value
                      ? "bg-[#34A858B2]"
                      : "bg-[#C83A272E] text-black"
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
              <div className="flex flex-row h-full w-full justify-center z-50">
                <span
                  className="rotate-90 font-bold cursor-pointer hover:scale-125 text-[20px]"
                  onClick={(e) => {
                    e.stopPropagation();
                    if (
                      user?.role === "Owner" ||
                      user?.id === params.row.registeredBy
                    ) {
                      onOption(params.row, e);
                    }
                  }}
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
