import { useEffect, useState } from "react";
import BoardMemberProfile from "./BoardMemberProfile";
import axios from "axios";
import { Management } from "@prisma/client";
import { Skeleton } from "@mui/material";
import { useTranslation } from "react-i18next";

const ManagementMembers = () => {
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const [selectedMember, setSelectedMember] = useState<any>();
  const [managers, setManagers] = useState<Management[]>();
  const [loading, setLoading] = useState(false);
  const { i18n, t } = useTranslation();
  const isAmharic = Boolean(i18n.language === "am");

  const fetchManagers = async () => {
    setLoading(true);
    try {
      const res = await axios.post("/api/cms/management/fetch", {
        page: 1,
        pageSize: 20,
      });
      if (res.data.success) {
        const latestManagers = res.data.value.managements;
        setManagers(latestManagers);
      }
    } catch (err) {
      console.error(err);
    }
    setLoading(false);
  };

  useEffect(() => {
    fetchManagers();
  }, []);

  const toggleDrawer = (open: boolean) => {
    setIsDrawerOpen(open);
  };

  return (
    <>
      <div className="font-light w-full overflow-x-clip">
        <div className="mb-4">
          <h1 className="font-bold text-lg">
            {t("about.management_heading_1")}
          </h1>
          <br />
          <p className="mb-8">{t("about.management_description")}</p>
        </div>
        <div className="grid grid-cols-3 gap-10 w-full ">
          {loading
            ? [1, 2, 3].map((item) => (
                <div key={item} className="min-h-[300px] w-full">
                  <Skeleton className="w-full h-full" />
                </div>
              ))
            : managers
                ?.filter((item) => !item.isBoardMember)
                .map((manager, index) => (
                  <div
                    key={index}
                    className="relative w-full h-[300px] rounded-lg hover:cursor-pointer"
                    style={{
                      background: `url('${manager?.photo}')`,
                      backgroundSize: "cover",
                      backgroundPosition: "center",
                    }}
                    onClick={() => {
                      setIsDrawerOpen(true);
                      setSelectedMember(manager);
                    }}
                  >
                    <div className="absolute flex flex-col w-full text-white bottom-0 left-0 pb-6 pl-2 pt-6 bg-gradient-to-t from-[rgb(0,0,0,0.9)] to-transparent">
                      <span className="font-bold text-xl w-[200px]">
                        {isAmharic
                          ? manager?.managerNameAmharic
                          : manager?.managerName}
                      </span>
                      <span className="max-w-[200px] truncate text-ellipsis text-lg">
                        {isAmharic ? manager?.jobAmharic : manager?.job}
                      </span>
                    </div>
                  </div>
                ))}
        </div>
      </div>

      <BoardMemberProfile
        manager={selectedMember}
        handleClose={() => toggleDrawer(false)}
        open={isDrawerOpen}
      />
    </>
  );
};

export default ManagementMembers;
