import { getServerSession } from "next-auth";
import AdminSettingHeader from "./AdminSettingHeader";
import { OPTIONS } from "@/util/authOptions";
import { redirect } from "next/navigation";
import prisma from "@/lib/prisma";
import { findUserById } from "@/db/user";
import UserSetting from "./UserSetting";

const Settings = async () => {
  const session = await getServerSession(OPTIONS);
  if (!session?.user?.id) {
    redirect("/admin/login");
  }
  const user = await findUserById(session.user?.id);
  return (
    <div className="flex flex-col w-full min-h-screen bg-[#f5f5f5] ">
      <AdminSettingHeader />
      <div className=" h-full w-full flex flex-col items-center ">
        <UserSetting user={user} />
      </div>
    </div>
  );
};

export default Settings;
