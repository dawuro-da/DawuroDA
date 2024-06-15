"use client";

import { Avatar, MenuItem, Skeleton } from "@mui/material";
import { signOut, useSession } from "next-auth/react";
import StyledMenu from "./StyledMenu";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { Logout,  PersonOutline } from "@mui/icons-material";

const PageHeader = () => {
  const session = useSession();
  const router = useRouter();
  const user = session?.data?.user;
  const [anchorEl, setAnchorEl] = useState<null | Element>(null);
  const open = Boolean(anchorEl);

  const handleClose = () => {
    setAnchorEl(null);
  };
  return (
    <>
      <StyledMenu anchorEl={anchorEl} open={open} onClose={handleClose}>
        <div>
          <MenuItem onClick={() => router.push("/admin/setting")}>
            <div className="flex flex-row items-center gap-2 px-2">
              <PersonOutline sx={{ height: 25, width: 25 }} />
              <span>Profile</span>
            </div>
          </MenuItem>
          <MenuItem onClick={() => signOut()}>
            <div className="flex flex-row items-center gap-2 px-2">
              <Logout sx={{ height: 23, width: 23 }} />
              <span>Sign Out</span>
            </div>
          </MenuItem>
        </div>
      </StyledMenu>
      <div className="p-6 px-[40px] w-full flex flex-row items-center justify-between bg-white">
        <span className="text-[32px] leading-[40px] font-[200] text-titleColor">
          CashFlow Control Center
        </span>
        <div
          className="flex flex-row items-center gap-4 font-bold cursor-pointer"
          onClick={(e) => setAnchorEl(e.currentTarget)}
        >
          <Avatar />
          {user?.id ? (
            <span> {`${user.firstName} ${user.lastName}`}</span>
          ) : (
            <Skeleton style={{ width: "100px", height: "40px" }} />
          )}
        </div>
      </div>
    </>
  );
};

export default PageHeader;
