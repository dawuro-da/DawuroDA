"use client";
import { getFormattedDate, getFormattedDateFromTimestamp } from "@/util/date";
import PageHeader from "../shared/PageHeader";
import { GridColDef } from "@mui/x-data-grid";
import CustomizedDatagrid, { PageState } from "../shared/CustomizedDatagrid";
import { useEffect, useState } from "react";
import axios from "axios";
import { useRouter } from "next/navigation";
import DateRangeSelector from "../shared/DateRangeSelector";
import StyledMenu from "../shared/StyledMenu";
import { ArrowDropDown } from "@mui/icons-material";
import { downloadExcel } from "@/util/helper";
import { showToastAction } from "@/redux/actions";
import { useDispatch } from "react-redux";

const Donation = () => {
  const dispatch = useDispatch();
  const [donations, setDonations] = useState<any[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [isSmScreen, setIsSmScreen] = useState<boolean>(false);
  const [generateLoading, setGenerateLoading] = useState(false);
  const [dateAnchor, setDateAnchor] = useState<null | Element>(null);
  const [totalCount, setTotalCount] = useState(0);
  const [filters, setFilters] = useState({});
  const [dateFilter, setDateFilter] = useState<{
    startDate: Date;
    endDate: Date;
  }>();

  const opendate = Boolean(dateAnchor);

  const fetchDonations = async ({ page, pageSize }: PageState) => {
    setLoading(true);
    const result = await axios.post("/api/donation/fetch", {
      page,
      pageSize,
      filters: {
        ...filters,
        startDate: dateFilter?.startDate,
        endDate: dateFilter?.endDate,
      },
    });

    if (result.data.success) {
      setDonations(result.data.value.donations);
      setTotalCount(result.data.value.total);
    }
    setLoading(false);
  };

  useEffect(() => {
    fetchDonations({ page: 1, pageSize: 5 });
  }, [filters, dateFilter]);

  useEffect(() => {
    // fetchdonations();
    if (window.innerWidth < 900) {
      setIsSmScreen(true);
    }
  }, []);

  const onConfirm = async (customer: any) => {};

  const handleDateClose = () => {
    setDateAnchor(null);
  };

  const onPageChange = async ({ page, pageSize }: PageState) => {
    await fetchDonations({ page, pageSize });
  };

  const generateDonationReport = async () => {
    setGenerateLoading(true);
    const result = await axios.post("/api/donation/fetch/all", {
      filters: {
        ...filters,
        startDate: dateFilter?.startDate,
        endDate: dateFilter?.endDate,
      },
    });

    if (result.data.success) {
      downloadExcel(result.data.value.donations,'DonationReport');
      dispatch(
        showToastAction({ message: "Successfully generated", type: "success" })
      );
    } else {
      dispatch(showToastAction({ message: result.data.error, type: "error" }));
    }
    setGenerateLoading(false);
  };

  return (
    <>
      <StyledMenu
        anchorEl={dateAnchor}
        open={opendate}
        onClose={handleDateClose}
      >
        <div>
          <DateRangeSelector
            dateFilter={dateFilter}
            setDateFilter={setDateFilter}
          />
        </div>
      </StyledMenu>
      <div className="h-full w-full overflow-y-auto">
        <PageHeader />
        <div className="px-[40px] py-10 w-full flex flex-col flex-1 ">
          <div className="flex flex-row justify-between items-center">
            <div className="flex flex-row items-center justify-center text-titleColor gap-10">
              <span className=" font-bold text-3xl">Donations</span>
              <span className="h-full mt-2">Total: {totalCount}</span>
            </div>
            <div className="min-w-[130px]">
              <div
                className="w-full border-[1px] h-full border-titleColor text-titleColor p-2 relative pr-8 text-center cursor-pointer rounded-[5px]"
                defaultValue={"All time"}
                onClick={(e) => setDateAnchor(e.currentTarget)}
              >
                {dateFilter?.startDate && dateFilter?.endDate
                  ? `${getFormattedDate(
                      dateFilter?.startDate
                    )} - ${getFormattedDate(dateFilter?.endDate)}`
                  : "All Time"}
                <ArrowDropDown className="absolute right-2 top-2" />
              </div>
            </div>
          </div>
          <div className="border-b-[1px] flex-1 border-b-titleColor opacity-25 mt-10" />
          <div className="h-[650px] mt-10">
            <CustomizedDatagrid
              columns={getColumnDefinition({
                onConfirm,
                isSmScreen: isSmScreen,
              })}
              rows={donations ?? []}
              loading={loading}
              onRowClick={() => {}}
              totalCount={totalCount}
              onPageChange={onPageChange}
              generateLoading={generateLoading}
              generateReport={generateDonationReport}
            />
          </div>
        </div>
      </div>
    </>
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
