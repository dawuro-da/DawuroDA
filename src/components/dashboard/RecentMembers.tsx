import { GridColDef } from "@mui/x-data-grid";
import axios from "axios";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import DashboardDatagrid from "./DashboardDatagrid";
import { Avatar } from "@mui/material";
import { getFormattedDateFromTimestamp } from "@/util/date";

const RecentMembers = () => {
  const router = useRouter();
  const [members, setMembers] = useState<any[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [isSmScreen, setIsSmScreen] = useState<boolean>(false);

  const fetchMembers = async () => {
    setLoading(true);
    const result = await axios.get("/api/member/fetch");
    if (result.data.success) {
      setMembers(result.data.value);
    }
    setLoading(false);
  };

  useEffect(() => {
    // fetchMembers();
    if (window.innerWidth < 900) {
      setIsSmScreen(true);
    }
  }, []);

  const onConfirm = async (customer: any) => {};

  return (
    <div className=" h-[820px] w-full">
      <DashboardDatagrid
        columns={getColumnDefinition({ onConfirm, isSmScreen: isSmScreen })}
        rows={rows ?? []}
        loading={loading}
      />
    </div>
  );
};

export default RecentMembers;

const getColumnDefinition = ({
  onConfirm,
  isSmScreen,
}: {
  onConfirm: (customer: any) => Promise<void>;
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
        },
        {
          field: "fullName",
          headerName: "Full Name",
          flex: 1,
          minWidth: 110,
          renderCell: (params) => {
            return (
              <span className="flex flex-row items-center gap-2 ">
                <Avatar sizes="small" src="" />
                <span>{params.value}</span>
              </span>
            );
          },
        },
        {
          field: "memberLevel",
          headerName: "Member Level",
          flex: 1,
          minWidth: 110,
          renderCell: (params) => {
            return (
              <div className="flex flex-row items-center gap-2 justify-center h-full">
                <span
                  className={`flex flex-row items-center justify-center w-fit ${
                    params.value === "Gold"
                      ? "bg-green-500"
                      : params.value === "Silver"
                      ? "bg-slate-500"
                      : "bg-red-950"
                  } text-white rounded-[8px] min-w-20 text-center px-4 h-8 `}
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
          renderCell: (params) => {
            return (
              <div className="flex flex-row items-center gap-2 justify-center h-full">
                <span
                  className={`flex flex-row items-center justify-center w-fit ${
                    params.value === "Paid" ? "bg-[#34A858B2]" : "bg-red-200"
                  } text-white rounded-[8px] min-w-20 text-center px-4 h-8 `}
                >
                  {params.value}
                </span>
              </div>
            );
          },
        },

        {
          field: "timestamp",
          headerName: "Timestamp",
          flex: 1,
          minWidth: 110,
          renderCell: (params) => {
            return <span>{getFormattedDateFromTimestamp(params.value)}</span>;
          },
        },
        {
          field: "action",
          headerName: "Actions",
          flex: 1,
          align: "center",
          maxWidth: 80,
          minWidth: 80,
          renderCell: (params) => {
            return (
              <div className="flex flex-row h-full w-full justify-center">
                <span
                  className="rotate-90 font-bold cursor-pointer hover:scale-125"
                  onClick={() => {}}
                >
                  ...
                </span>
              </div>
            );
          },
        },
      ]
    : [
        {
          field: "fullName",
          headerName: "Full Name",
          flex: 1,
          minWidth: 110,
          renderCell: (params) => {
            return (
              <span className="flex flex-row items-center gap-2 ">
                <Avatar sizes="small" src="" />
                <span>{params.value}</span>
              </span>
            );
          },
        },
        {
          field: "hasPaid",
          headerName: "Paid",
          flex: 1,
          minWidth: 110,
          renderCell: (params) => {
            return (
              <span className="flex flex-row items-center gap-2">
                <span className="w-fit bg-[#34A858B2] text-white rounded-[8px] min-w-12 text-center h-fit">
                  {params.value}
                </span>
              </span>
            );
          },
        },
        {
          field: "action",
          headerName: "Actions",
          flex: 1,
          align: "center",
          maxWidth: 80,
          minWidth: 80,
          renderCell: (params) => {
            return (
              <div className="flex flex-row h-full w-full justify-center">
                <span
                  className="rotate-90 font-bold cursor-pointer hover:scale-125"
                  onClick={() => {}}
                >
                  ...
                </span>
              </div>
            );
          },
        },
      ];


const rows = [
  {
    id: 1,
    memberId: 1001,
    fullName: "John Doe",
    memberLevel: "Gold",
    hasPaid: "Paid",
    timestamp: "2023-12-25T12:30:00Z",
  },
  {
    id: 2,
    memberId: 1002,
    fullName: "Jane Smith",
    memberLevel: "Silver",
    hasPaid: "Unpaid",
    timestamp: "2023-12-26T09:45:00Z",
  },
  {
    id: 3,
    memberId: 1003,
    fullName: "Michael Johnson",
    memberLevel: "Gold",
    hasPaid: "Paid",
    timestamp: "2023-12-27T15:20:00Z",
  },
  {
    id: 4,
    memberId: 1004,
    fullName: "Emily Wilson",
    memberLevel: "Bronze",
    hasPaid: "Paid",
    timestamp: "2023-12-28T11:10:00Z",
  },
  {
    id: 5,
    memberId: 1005,
    fullName: "David Brown",
    memberLevel: "Silver",
    hasPaid: "Unpaid",
    timestamp: "2023-12-29T14:55:00Z",
  },
  {
    id: 6,
    memberId: 1006,
    fullName: "Olivia Martinez",
    memberLevel: "Gold",
    hasPaid: "Paid",
    timestamp: "2023-12-30T17:40:00Z",
  },
  {
    id: 7,
    memberId: 1007,
    fullName: "William Rodriguez",
    memberLevel: "Gold",
    hasPaid: "Paid",
    timestamp: "2023-12-31T10:25:00Z",
  },
  {
    id: 8,
    memberId: 1008,
    fullName: "Emma Taylor",
    memberLevel: "Silver",
    hasPaid: "Unpaid",
    timestamp: "2024-01-01T13:15:00Z",
  },
  {
    id: 9,
    memberId: 1009,
    fullName: "James Wilson",
    memberLevel: "Gold",
    hasPaid: "Paid",
    timestamp: "2024-01-02T16:05:00Z",
  },
  {
    id: 10,
    memberId: 1010,
    fullName: "Sophia Brown",
    memberLevel: "Bronze",
    hasPaid: "Unpaid",
    timestamp: "2024-01-03T19:00:00Z",
  },
];
