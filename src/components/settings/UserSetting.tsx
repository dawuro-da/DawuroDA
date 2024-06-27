"use client";

import { User, UserRole } from "@prisma/client";
import { useEffect, useState } from "react";
import ProfileManagement from "./ProfileManagement";
import AdminManagement from "./AdminManagement";
import axios from "axios";

enum TABS {
  PrfoileManagement,
  AdminManagement,
}

const UserSetting = ({ user }: { user: User | null }) => {
  const isOwner = Boolean(user?.role === UserRole.Owner);
  const [activeTab, setActiveTab] = useState<TABS>(TABS.PrfoileManagement);

  const initializeCronJob = async () => {
    try {
      const res = await axios.get("/api/sms/notifyPaymentDate");
    } catch (err) {
      console.error("cron error", err);
    }
  };

  useEffect(() => {
    initializeCronJob();
  }, []);

  return (
    <div className="flex flex-col items-center p-10">
      <div className="flex flex-col pt-6 gap-6">
        <div className="flex flex-row items-center justify-center gap-6">
          <span
            onClick={() => setActiveTab(TABS.PrfoileManagement)}
            className={`p-3 px-6 border-b-2 border-b-slate-200 cursor-pointer ${
              isOwner && activeTab === TABS.PrfoileManagement && "bg-slate-200"
            } rounded-md`}
          >
            Profile Management
          </span>
          {isOwner && (
            <span
              onClick={() => setActiveTab(TABS.AdminManagement)}
              className={`p-3 px-6 border-b-2 border-b-slate-200 cursor-pointer ${
                activeTab === TABS.AdminManagement && "bg-slate-200"
              } rounded-md`}
            >
              Admin Management
            </span>
          )}
        </div>
        {activeTab === TABS.PrfoileManagement ? (
          <ProfileManagement user={user} />
        ) : (
          <AdminManagement />
        )}
      </div>
    </div>
  );
};

export default UserSetting;
