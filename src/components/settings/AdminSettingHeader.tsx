"use client";

import { Logout } from "@mui/icons-material";
import { Button } from "@mui/material";
import { signOut } from "next-auth/react";
import Image from "next/image";
import { useRouter } from "next/navigation";

const AdminSettingHeader = () => {
  const router = useRouter();
  return (
    <div className="bg-white flex flex-row items-center justify-between p-6 px-[40px] w-full">
      <div
        onClick={() => router.push("/admin/dashboard")}
        className="w-fit flex flex-row items-center gap-2 cursor-pointer"
      >
        <Image src={"/icons/dashboardGrey.svg"} alt="" height={30} width={30} />
        <span className="xl:text-[30px] lg:text-[30px] text-[20px] text-titleColor capitalize">
          Dashboard
        </span>
      </div>
      <span className="text-4xl text-titleColor xl:lg:block md:block hidden">
        Admin Settings
      </span>
      <div>
        <Button
          onClick={() => signOut()}
          className="flex text-gray-500 border-gray-500 bg-gray-200 hover:bg-gray-200 capitalize px-4 flex-row items-center justify-center gap-2"
        >
          <Logout /> Logout
        </Button>
      </div>
    </div>
  );
};

export default AdminSettingHeader;
