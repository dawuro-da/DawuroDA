"use client";

import { Button, IconButton, MenuItem, Select, TextField } from "@mui/material";
import PageHeader from "../shared/PageHeader";
import { SearchOutlined } from "@mui/icons-material";
import { useState } from "react";
import {
  ContributionSystem,
  MembershipLevel,
  MembershipType,
} from "@prisma/client";

const SMS = () => {
  const [searchText, setSearchText] = useState<string>("");
  const [refetch, setRefetch] = useState<boolean>(false);
  const [filters, setFilters] = useState({
    membershipLevel: "",
    contributionSystem: "",
    membershipType: "",
    paymentStatus: "",
  });

  return (
    <div className="h-full w-full overflow-y-auto">
      <PageHeader />
      <div className="flex flex-row flex-1 h-full">
        <div className="lg:pl-[40px] md:pl-[40px] pl-[20px] py-10 w-full flex flex-col max-w-[350px] min-w-[300px] h-full border-r-2">
          <span className="text-titleColor font-bold text-3xl">Messages</span>
          <span className="text-primaryColor border-b-2 p-[6px] mt-4 ">
            <span className="border-b-2 border-b-primaryColor p-[7px] px-6">
              History
            </span>
          </span>
        </div>
        <div className="lg:px-[40px] md:px-[40px] px-[20px] py-10 w-full flex flex-col gap-6 h-full">
          <div className="flex flex-row gap-6 justify-end w-full">
            <Button
              variant="outlined"
              className=" text-primaryColor capitalize p-3 px-4 w-[180px] flex flex-row items-center gap-2 shadow-none"
            >
              <span>Automated Message</span>
            </Button>
            <Button
              variant="contained"
              className=" font-bold border-none p-3 px-4 w-[180px] bg-primaryColor text-white capitalize flex flex-row items-center gap-2 shadow-none"
            >
              <span>New Message</span>
            </Button>
          </div>
          <span className="text-3xl text-titleColor">Select Recipients</span>
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
