import { GridColDef } from "@mui/x-data-grid";
import axios from "axios";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import DashboardDatagrid from "./DashboardDatagrid";
import { Avatar } from "@mui/material";
import { getFormattedDateFromTimestamp } from "@/util/date";
import { Member, MembershipLevel } from "@prisma/client";

const RecentMembers = () => {
  const router = useRouter();
  const [members, setMembers] = useState<any[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [isSmScreen, setIsSmScreen] = useState<boolean>(false);

  const fetchRecentMembers = async () => {
    setLoading(true);
    const result = await axios.get("/api/member/fetch/recent");

    if (result.data.success) {
      setMembers(result.data.value);
    }
    setLoading(false);
  };

  useEffect(() => {
    fetchRecentMembers();
    if (window.innerWidth < 900) {
      setIsSmScreen(true);
    }
  }, []);

  const onRowClick = async () => {
    router.push("/admin/dashboard/members");
  };

  return (
    <div className=" h-[620px] w-full">
      <DashboardDatagrid
        columns={getColumnDefinition({ isSmScreen: isSmScreen })}
        rows={members ?? []}
        loading={loading}
        onRowClick={onRowClick}
      />
    </div>
  );
};

export default RecentMembers;

const getColumnDefinition = ({
  isSmScreen,
}: {
  isSmScreen: boolean;
}): GridColDef[] =>
  !isSmScreen
    ? [
        {
          field: "memberId",
          headerName: "MemberId",
          flex: 1,
          minWidth: 110,
          align: "center",
          headerAlign: "center",
        },
        {
          field: "firstName",
          headerName: "Full Name",
          flex: 1,
          minWidth: 110,

          renderCell: (params) => {
            return (
              <span className="flex flex-row items-center gap-2 ">
                <Avatar sizes="small" src={params?.row?.profileImage} />
                {params.row.firstName && (
                  <span>
                    {params.row.firstName} {params.row.lastName}
                  </span>
                )}
                {params.row.institutionName && (
                  <span>{params.row.institutionName}</span>
                )}
              </span>
            );
          },
        },
        {
          field: "membershipLevel",
          headerName: "Membership Level",
          flex: 1,
          minWidth: 110,
          headerAlign: "center",
          renderCell: (params) => {
            return (
              <div className="flex flex-row items-center gap-2 justify-center h-full">
                <span
                  className={`flex  flex-row items-center justify-center w-fit ${
                    params.value === MembershipLevel.Platinium
                      ? "bg-[#34A8A8] text-white"
                      : params.value === MembershipLevel.Diamond
                      ? "bg-[#B0E0E62E] text-titleColor"
                      : params.value === MembershipLevel.Gold
                      ? "bg-[#FFD7002E]"
                      : params.value === MembershipLevel.Siliver
                      ? "bg-[#C0C0C02E]"
                      : "bg-transparent"
                  }  rounded-[8px] min-w-20 text-center px-4 h-8 `}
                >
                  {params.value}
                </span>
              </div>
            );
          },
        },
        {
          field: "hasPaid",
          headerName: "Paid",
          flex: 1,
          minWidth: 110,
          headerAlign: "center",
          renderCell: (params) => {
            return (
              <div className="flex flex-row items-center gap-2 justify-center h-full">
                <span
                  className={`flex flex-row items-center justify-center w-fit ${
                    params.value
                      ? "bg-[#34A858B2]"
                      : "bg-[#C83A272E] text-black"
                  } text-white rounded-[8px] min-w-20 text-center px-4 h-8 `}
                >
                  {params.value ? "Paid" : "Unpaid"}
                </span>
              </div>
            );
          },
        },

        {
          field: "lastPaidAt",
          headerName: "Timestamp",
          flex: 1,
          minWidth: 110,
          renderCell: (params) => {
            return <span>{getFormattedDateFromTimestamp(params.value)}</span>;
          },
        },
        // {
        //   field: "action",
        //   headerName: "Actions",
        //   flex: 1,
        //   align: "center",
        //   maxWidth: 120,
        //   minWidth: 120,
        //   renderCell: (params) => {
        //     return (
        //       <div className="flex flex-row h-full w-full justify-center z-50">
        //         <span
        //           className="rotate-90 font-bold cursor-pointer hover:scale-125"
        //           onClick={(e) => {
        //             e.stopPropagation();
        //           }}
        //         >
        //           ...
        //         </span>
        //       </div>
        //     );
        //   },
        // },
      ]
    : [
        {
          field: "memberId",
          headerName: "MemberId",
          flex: 1,
          minWidth: 110,
          align: "center",
          headerAlign: "center",
        },
        {
          field: "firstName",
          headerName: "Full Name",
          flex: 1,
          minWidth: 110,

          renderCell: (params) => {
            return (
              <span className="flex flex-row items-center gap-2 ">
                <Avatar sizes="small" src="" />
                {params.row.firstName && (
                  <span>
                    {params.row.firstName} {params.row.lastName}
                  </span>
                )}
                {params.row.institutionName && (
                  <span>{params.row.institutionName}</span>
                )}
              </span>
            );
          },
        },
        {
          field: "hasPaid",
          headerName: "Paid",
          flex: 1,
          minWidth: 110,
          headerAlign: "center",
          renderCell: (params) => {
            return (
              <div className="flex flex-row items-center gap-2 justify-center h-full">
                <span
                  className={`flex flex-row items-center justify-center w-fit ${
                    params.value
                      ? "bg-[#34A858B2]"
                      : "bg-[#C83A272E] text-black"
                  } text-white rounded-[8px] min-w-20 text-center px-4 h-8 `}
                >
                  {params.value ? "Paid" : "Unpaid"}
                </span>
              </div>
            );
          },
        },
        // {
        //   field: "action",
        //   headerName: "Actions",
        //   flex: 1,
        //   align: "center",
        //   maxWidth: 80,
        //   minWidth: 80,
        //   renderCell: (params) => {
        //     return (
        //       <div className="flex flex-row h-full w-full justify-center z-50">
        //         <span
        //           className="rotate-90 font-bold cursor-pointer hover:scale-125"
        //           onClick={(e) => {
        //             e.stopPropagation();
        //             if (adminId === params.row.registeredBy) {
        //               onOption(params.row, e);
        //             }
        //           }}
        //         >
        //           ...
        //         </span>
        //       </div>
        //     );
        //   },
        // },
      ];

const selectStyle = {
  ".MuiOutlinedInput-notchedOutline": {
    border: 0,
  },
  color: "#555555",
};
