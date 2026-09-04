"use client";

import { useState } from "react";
import MembershipLevels from "../membershipLevels/MembershipLevels";
import BankAccounts from "../bankAccounts/BankAccounts";
import PageHeader from "../shared/PageHeader";

enum TABS {
  MembershipLevels,
  BankAccounts,
}

const Configuration = () => {
  const [activeTab, setActiveTab] = useState<TABS>(TABS.MembershipLevels);

  return (
    <div className="h-full w-full overflow-y-auto">
      <PageHeader />
      <div className="flex flex-row items-center gap-6 px-10 pt-6">
        <span
          onClick={() => setActiveTab(TABS.MembershipLevels)}
          className={`p-3 px-6 border-b-2 border-b-slate-200 cursor-pointer ${
            activeTab === TABS.MembershipLevels && "bg-slate-200"
          } rounded-md`}
        >
          Membership Levels
        </span>
        <span
          onClick={() => setActiveTab(TABS.BankAccounts)}
          className={`p-3 px-6 border-b-2 border-b-slate-200 cursor-pointer ${
            activeTab === TABS.BankAccounts && "bg-slate-200"
          } rounded-md`}
        >
          Bank Accounts
        </span>
      </div>
      {activeTab === TABS.MembershipLevels && <MembershipLevels />}
      {activeTab === TABS.BankAccounts && <BankAccounts />}
    </div>
  );
};

export default Configuration;
