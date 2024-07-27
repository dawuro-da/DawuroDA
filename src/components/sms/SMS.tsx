"use client";

import {
  Avatar,
  Button,
  Checkbox,
  IconButton,
  LinearProgress,
  MenuItem,
  Select,
  TextField,
} from "@mui/material";
import PageHeader from "../shared/PageHeader";
import { SearchOutlined } from "@mui/icons-material";
import { useEffect, useState } from "react";
import {
  ContributionSystem,
  MembershipLevel,
  MembershipType,
  SmsMessage,
} from "@prisma/client";
import Image from "next/image";
import SmsTable from "./SmsTable";
import axios from "axios";
import { useDispatch } from "react-redux";
import { showToastAction } from "@/redux/actions";

export interface SmsMemberData {
  memberId: string;
  name: string;
  phone: string;
  hasPaid: boolean;
}
const SMS = () => {
  const dispatch = useDispatch();
  const [searchText, setSearchText] = useState<string>("");
  const [messageToSend, setMessageToSend] = useState<string>("");
  const [refetch, setRefetch] = useState<boolean>(false);
  const [selectedList, setSelectedList] = useState<any[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [members, setMembers] = useState<SmsMemberData[]>([]);
  const [totalCount, setTotalCount] = useState<number>(0);
  const [sms, setSms] = useState<SmsMessage[]>();
  const [selectedSMS, setSelectedSMS] = useState<SmsMessage>();
  const [smsLoading, setSmsLoading] = useState<boolean>(false);
  const [filters, setFilters] = useState({
    membershipLevel: "",
    contributionSystem: "",
    membershipType: "",
  });

  const fetchMembers = async () => {
    setLoading(true);
    const result = await axios.post("/api/member/fetch/forSms", {
      filters: {
        ...filters,
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

  const fetchRecentMessages = async () => {
    setSmsLoading(true);
    try {
      const result = await axios.post("/api/sms/fetch");

      if (result.data.success) {
        setSms(result.data.value);
      }
    } catch (err: any) {
      dispatch(
        showToastAction({ message: err.response.data.error, type: "error" })
      );
    }
    setSmsLoading(false);
  };

  useEffect(() => {
    fetchRecentMessages();
  }, []);

  useEffect(() => {
    fetchMembers();
  }, [filters, refetch]);

  return (
    <div className="h-full w-full overflow-y-auto">
      <PageHeader />
      <div className="flex flex-row flex-1 h-full w-full overflow-x-auto">
        <div className="hidden lg:pl-[40px] md:pl-[40px] pl-[20px] py-10 w-full xl:lg:flex md:flex flex-col max-w-[350px] min-w-[300px] h-full border-r-2">
          <span className="text-titleColor font-bold text-3xl">Messages</span>
          <span className="text-primaryColor border-b-2 p-[6px] mt-4 ">
            <span className="border-b-2 border-b-primaryColor p-[7px] px-6">
              History
            </span>
          </span>
          <div className="w-full border-b-2 ">
            {smsLoading && <LinearProgress />}
          </div>
          <div className="flex flex-col gap-2 pt-2 w-full h-full overflow-y-auto">
            {sms?.map((sms) => {
              return (
                <div
                  key={sms.id}
                  onClick={() => setSelectedSMS(sms)}
                  className="flex flex-row items-center gap-1 w-full px-4 py-2 hover:cursor-pointer hover:bg-[rgb(0,0,0,0.1)]"
                >
                  <Avatar className="min-h-[40px] min-w-[40px]" />
                  <div className="flex-1 flex flex-col gap-2">
                    <span className="w-full truncate text-ellipsis text-titleColor">
                      {sms.message}
                    </span>
                    <span className="font-bold text-sm">{sms.totalPhones}</span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
        <div className="min-w-[500px] lg:px-[40px] md:px-[40px] px-[20px] py-10 w-full flex flex-col gap-6 h-full overflow-y-auto hiddenscrollbar">
          <div className="flex flex-row gap-6 justify-end w-full">
            <Button
              onClick={() => setSelectedSMS(undefined)}
              variant="contained"
              className=" font-bold border-none p-3 px-4 w-[180px] bg-primaryColor text-white capitalize flex flex-row items-center gap-2 shadow-none"
            >
              <span>New Message</span>
            </Button>
          </div>
          {Boolean(selectedSMS) && (
            <div className="w-full flex flex-col gap-6 h-full text-center justify-center">
              <span className="text-titleColor min-h-[200px] w-full">{selectedSMS?.message}</span>
              <span className="font-bold">
                Sent for {selectedSMS?.totalPhones} members
              </span>
            </div>
          )}
          {!Boolean(selectedSMS) && (
            <div className="w-full flex flex-col gap-6 h-full -mt-2">
              <span className="text-3xl text-titleColor">
                Select Recipients
              </span>
              <TextField
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
                    maxWidth: "800px",
                  },
                }}
              />
              <div className="flex xl:flex-row lg:flex-row md:flex-row flex-col xl:lg:items-center md:items-center xl:lg:justify-start md:justify-start justify-center  gap-6 w-full">
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
                    <MenuItem value={MembershipLevel?.Platinium}>
                      {MembershipLevel?.Platinium}
                    </MenuItem>
                    <MenuItem value={MembershipLevel?.Diamond}>
                      {MembershipLevel?.Diamond}
                    </MenuItem>
                    <MenuItem value={MembershipLevel?.Gold}>
                      {MembershipLevel?.Gold}
                    </MenuItem>
                    <MenuItem value={MembershipLevel?.Siliver}>
                      {MembershipLevel?.Siliver}
                    </MenuItem>
                    <MenuItem value={MembershipLevel?.Bronze}>
                      {MembershipLevel?.Bronze}
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
              </div>
              <div className="w-full border-b-2 ">
                {loading && <LinearProgress />}
              </div>
              <>
                <SmsTable
                  loading={loading}
                  members={members}
                  selectedList={selectedList}
                  setSelectedList={setSelectedList}
                  messageToSend={messageToSend}
                  setMessageToSend={setMessageToSend}
                />
              </>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default SMS;

const selectStyle = {
  ".MuiOutlinedInput-notchedOutline": {
    border: 0,
  },
  color: "#555555",
};
