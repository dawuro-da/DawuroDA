"use client";
import { getFormattedDateFromTimestamp } from "@/util/date";
import PageHeader from "../shared/PageHeader";
import { Avatar, MenuItem, Select } from "@mui/material";
import { GridColDef } from "@mui/x-data-grid";
import CustomizedDatagrid from "../shared/CustomizedDatagrid";
import { useEffect, useState } from "react";
import axios from "axios";
import { useRouter } from "next/navigation";

const Donation = () => {
  const router = useRouter();
  const [searchValue, setSearchValue] = useState<string>("");
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
    <div className="h-full w-full overflow-y-auto">
      <PageHeader />
      <div className="px-[40px] py-10 w-full flex flex-col flex-1 ">
        <div className="flex flex-row justify-between items-center">
          <span className="text-titleColor font-bold text-3xl">Donations</span>
          <div className="w-[130px]">
            <Select className="w-full" defaultValue={"All time"} size="small">
              <MenuItem value="All time">All time</MenuItem>
              <MenuItem value="last 7 day">last 7 days</MenuItem>
              <MenuItem value="last month">last month</MenuItem>
            </Select>
          </div>
        </div>
        <div className="border-b-[1px] flex-1 border-b-titleColor opacity-25 mt-10" />
        <div className="h-[650px] mt-10">
          <CustomizedDatagrid
            columns={getColumnDefinition({ onConfirm, isSmScreen: isSmScreen })}
            rows={rows ?? []}
            loading={false}
            onRowClick={() => {}}
            totalCount={10}
            onPageChange={() => {}}
          />
        </div>
      </div>
    </div>
  );
};

export default Donation;

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
          field: "fullName",
          headerName: "Full Name",
          flex: 1,
          minWidth: 110,

          renderCell: (params) => {
            return (
              <span className="flex flex-row items-center gap-2 ">
                <span>{params.value}</span>
              </span>
            );
          },
        },
        {
          field: "tel",
          headerName: "Tel",
          flex: 1,
          minWidth: 110,
        },
        {
          field: "donationAmount",
          headerName: "Paid",
          flex: 1,
          minWidth: 110,
        },

        {
          field: "donationDesignation",
          headerName: "Donation Designation",
          flex: 1,
          minWidth: 110,
        },
        {
          field: "paymentMethod",
          headerName: "Payment Method",
          flex: 1,
          minWidth: 110,
        },
        {
          field: "timestamp",
          headerName: "Timestamp",
          flex: 1,
          minWidth: 110,
          renderCell(params) {
            return <span>{getFormattedDateFromTimestamp(params.value)}</span>;
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
                <span>{params.value}</span>
              </span>
            );
          },
        },
        {
          field: "tel",
          headerName: "Tel",
          flex: 1,
          minWidth: 110,
          headerAlign: "center",
        },
        {
          field: "donationAmount",
          headerName: "Paid",
          flex: 1,
          minWidth: 110,
          headerAlign: "center",
        },
      ];

const rows = [
  {
    id: 1,
    fullName: "John Doe",
    tel: "+1234567890",
    donationAmount: 100,
    donationDesignation: "Education Fund",
    paymentMethod: "Credit Card",
    timestamp: "2024-05-07T12:30:00Z",
  },
  {
    id: 2,
    fullName: "Jane Smith",
    tel: "+9876543210",
    donationAmount: 50,
    donationDesignation: "Medical Research",
    paymentMethod: "PayPal",
    timestamp: "2024-05-06T09:45:00Z",
  },
  {
    id: 3,
    fullName: "Alice Johnson",
    tel: "+1555123456",
    donationAmount: 200,
    donationDesignation: "Animal Shelter",
    paymentMethod: "Venmo",
    timestamp: "2024-05-05T15:20:00Z",
  },
  {
    id: 4,
    fullName: "Bob Williams",
    tel: "+1122334455",
    donationAmount: 75,
    donationDesignation: "Environmental Conservation",
    paymentMethod: "Bank Transfer",
    timestamp: "2024-05-04T11:10:00Z",
  },
  {
    id: 5,
    fullName: "Eva Brown",
    tel: "+9988776655",
    donationAmount: 150,
    donationDesignation: "Homeless Shelter",
    paymentMethod: "Bitcoin",
    timestamp: "2024-05-03T14:55:00Z",
  },
  {
    id: 6,
    fullName: "Michael Clark",
    tel: "+1122334455",
    donationAmount: 120,
    donationDesignation: "Disaster Relief",
    paymentMethod: "Cash",
    timestamp: "2024-05-02T17:40:00Z",
  },
  {
    id: 7,
    fullName: "Sarah Lee",
    tel: "+1122334455",
    donationAmount: 90,
    donationDesignation: "Arts and Culture",
    paymentMethod: "Credit Card",
    timestamp: "2024-05-01T10:25:00Z",
  },
  {
    id: 8,
    fullName: "David Miller",
    tel: "+1122334455",
    donationAmount: 80,
    donationDesignation: "Community Development",
    paymentMethod: "PayPal",
    timestamp: "2024-04-30T13:15:00Z",
  },
  {
    id: 9,
    fullName: "Emily Taylor",
    tel: "+1122334455",
    donationAmount: 110,
    donationDesignation: "Youth Empowerment",
    paymentMethod: "Venmo",
    timestamp: "2024-04-29T16:05:00Z",
  },
  {
    id: 10,
    fullName: "James Wilson",
    tel: "+1122334455",
    donationAmount: 70,
    donationDesignation: "Elderly Care",
    paymentMethod: "Bank Transfer",
    timestamp: "2024-04-28T19:00:00Z",
  },
];
