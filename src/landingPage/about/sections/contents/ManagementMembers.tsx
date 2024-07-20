import { useEffect, useState } from "react";
import BoardMemberProfile from "./BoardMemberProfile";
import axios from "axios";
import { Management } from "@prisma/client";

const ManagementMembers = () => {
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const [selectedMember, setSelectedMember] = useState<any>();
  const [managers, setManagers] = useState<Management[]>();
  const [loading, setLoading] = useState(false);

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
      console.log(err);
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
          <h1 className="font-bold text-lg">Managements</h1>
          <br />
          <p className="mb-8">
            Board of directors is next to general assembly that has also crucial
            role in setting and deciding on policy level issues and
            developmental direction of the organization.
          </p>
        </div>
        <div className="grid grid-cols-3 gap-10 w-full ">
          {managers
            ?.filter((item) => !item.isBoardMember)
            .map((manager, index) => (
              <div
                key={index}
                className="relative w-full h-[300px] rounded-lg hover:cursor-pointer"
                style={{
                  background: `url('${manager.photo}')`,
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
                    {manager.managerName}
                  </span>
                  <span className="max-w-[200px] truncate text-ellipsis text-lg">
                    {manager.job}
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
