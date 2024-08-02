"use client";

import { Avatar, MenuItem, Skeleton } from "@mui/material";
import { signOut, useSession } from "next-auth/react";
import { useEffect, useState } from "react";
import { usePathname, useRouter } from "next/navigation";
import {
  Dashboard,
  DashboardOutlined,
  Logout,
  PersonOutline,
} from "@mui/icons-material";
import StyledMenu from "@/components/shared/StyledMenu";
import axios from "axios";

const ProfileMenu = () => {
  const session = useSession();
  const router = useRouter();
  const pathname = usePathname();
  const isHome = Boolean(pathname === "/");
  const user = session?.data?.user;
  const [userData, setUserData] = useState<any>(user);
  const [anchorEl, setAnchorEl] = useState<null | Element>(null);
  const open = Boolean(anchorEl);

  const handleClose = () => {
    setAnchorEl(null);
  };

  const fetchMemberProfile = async () => {
    try {
      const res = await axios.get(`/api/member/fetch/profile/${user?.id}`);
      if (res.data.success) {
        setUserData(res.data.value);
      }
    } catch (err) {
      console.error(err);
      setUserData(user);
    }
  };

  useEffect(() => {
    fetchMemberProfile();
  }, []);

  return (
    <>
      <StyledMenu anchorEl={anchorEl} open={open} onClose={handleClose}>
        <div>
          <MenuItem onClick={() => router.push("/member/dashboard")}>
            <div className="flex flex-row items-center gap-2 px-2">
              <DashboardOutlined sx={{ height: 25, width: 25 }} />
              <span>Dashboard</span>
            </div>
          </MenuItem>
          <MenuItem onClick={() => router.push("/member/profile")}>
            <div className="flex flex-row items-center gap-2 px-2">
              <PersonOutline sx={{ height: 25, width: 25 }} />
              <span>Profile</span>
            </div>
          </MenuItem>
          <MenuItem onClick={() => signOut()}>
            <div className="flex flex-row items-center gap-2 px-2">
              <Logout sx={{ height: 23, width: 25 }} />
              <span>Sign Out</span>
            </div>
          </MenuItem>
        </div>
      </StyledMenu>

      <div
        className="flex flex-row items-center gap-4 font-bold cursor-pointer w-[220px]"
        onClick={(e) => setAnchorEl(e.currentTarget)}
      >
        <Avatar src={userData?.profileImage} />
        {user?.firstName ? (
          <span className={`${isHome && "xl:lg:text-white md:text-black"}`}>
            {userData.name
              ? userData.name
              : `${user.firstName} ${user.lastName}`}
          </span>
        ) : (
          <Skeleton style={{ width: "100px", height: "40px" }} />
        )}
      </div>
    </>
  );
};

export default ProfileMenu;
