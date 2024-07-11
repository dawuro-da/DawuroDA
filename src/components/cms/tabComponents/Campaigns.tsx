import { PageState } from "@/components/dashboard/DashboardDatagrid";
import { showToastAction } from "@/redux/actions";
import { SearchOutlined, Upload } from "@mui/icons-material";
import {
  Button,
  Checkbox,
  CircularProgress,
  IconButton,
  TextField,
} from "@mui/material";
import { Campaign } from "@prisma/client";
import axios from "axios";
import Image from "next/image";
import { useEffect, useState } from "react";
import { FieldValues, useForm } from "react-hook-form";
import { useDispatch } from "react-redux";
import CampaignEdit from "./CampaignEdit";
import { DatePicker, LocalizationProvider } from "@mui/x-date-pickers";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";

const Campaigns = () => {
  const dispatch = useDispatch();
  const [refetch, setRefetch] = useState<boolean>(false);
  const [loading, setLoading] = useState<boolean>(false);
  const [fetchLoading, setfetchLoading] = useState<boolean>(false);
  const [searchText, setSearchText] = useState<string>("");
  const [campaigns, setCampaigns] = useState<Campaign[]>();
  const [totalCount, setTotalCount] = useState<number>(0);
  const [selectedCampaign, setSelectedCampaign] = useState<Campaign>();
  const [createCampaignForm, setCreateCampaignForm] = useState(false);
  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
    watch,
    setValue,
  } = useForm();

  const fetchcampaign = async ({ page, pageSize }: PageState) => {
    setfetchLoading(true);
    const result = await axios.post("/api/cms/campaign/fetch", {
      page,
      pageSize,
      searchText,
    });

    if (result.data.success) {
      setCampaigns(result.data.value.campaigns);
      setTotalCount(result.data.value.total);
    }
    setfetchLoading(false);
  };

  useEffect(() => {
    fetchcampaign({ page: 1, pageSize: 30 });
  }, [refetch]);

  useEffect(() => {}, [selectedCampaign]);

  const handleRegister = async (values: FieldValues) => {
    setLoading(true);
    try {
      const res = await axios.post("/api/cms/campaign/create", {
        ...values,
      });

      if (res?.status === 200) {
        dispatch(
          showToastAction({
            message: "Successfully Done",
            type: "success",
          })
        );
        setRefetch(!refetch);
        reset();
      }
    } catch (err: any) {
      console.error(err);
      dispatch(
        showToastAction({
          message: err?.response?.data?.error ?? "something went wrong",
          type: "error",
        })
      );
    }
    setLoading(false);
  };

  return (
    <div className="flex flex-row flex-1 mt-2 text-[#7C7C7C] h-full min-w-fit w-full">
      <div className="h-full flex flex-col max-w-[400px] min-w-[300px] border-r-[1px] border-[#d1d1d1]">
        <div className="lg:pl-[40px] md:pl-[40px] pl-[20px] py-4 pr-6 flex flex-col border-[1px] gap-4 border-[#d1d1d1] border-r-0 h-[140px]">
          <div className="flex flex-row justify-between items-center">
            <span className="font-bold text-xl">Campaigns</span>
            <span className="flex flex-rwo items-center gap-2">
              <Image
                src={"/icons/bx_edit.svg"}
                alt=""
                width={20}
                height={20}
                className="cursor-pointer"
                onClick={() => {
                  setSelectedCampaign(undefined);
                  setCreateCampaignForm(true);
                }}
              />
            </span>
          </div>
          <TextField
            fullWidth
            id="navbar-searchfield"
            size="small"
            name="searchText"
            variant="filled"
            value={searchText}
            onChange={(e) => {
              if (e.target.value === "") {
                setRefetch(!refetch);
              }
              setSearchText(e.target.value);
            }}
            onKeyDown={(e) => {
              if (e.key === "Enter") {
                setRefetch(!refetch);
              }
            }}
            hiddenLabel
            placeholder="Search by name, id, phone..."
            InputProps={{
              startAdornment: (
                <IconButton
                  style={{
                    borderRadius: "16px",
                    borderLeft: 20,
                  }}
                  onClick={() => {
                    setRefetch(!refetch);
                  }}
                >
                  <SearchOutlined style={{ color: "#555555" }} />
                </IconButton>
              ),
              disableUnderline: true,
              sx: {
                width: "100%",
                color: "#555555",
                backgroundColor: "#ffffff",
                borderRadius: "16px",
                paddingLeft: 0,
                paddingRight: 2,
              },
            }}
          />
        </div>
        <div className="flex-1 px-4 mt-6 flex flex-col gap-4">
          {fetchLoading ? (
            <CircularProgress />
          ) : (
            campaigns?.map((item, index) => {
              return (
                <div
                  key={item.id}
                  onClick={() => setSelectedCampaign(item)}
                  className={`relative w-full h-[50px] flex flex-row items-center ${
                    selectedCampaign?.id === item.id && "bg-[#e5e5e6]"
                  } gap-2 hover:bg-[#e5e5e6] cursor-pointer`}
                >
                  {/* <Image
                    src={"/icons/list.png"}
                    alt=""
                    height={50}
                    width={50}
                    className="h-full"
                  /> */}
                  <span className=" overflow-clip text-ellipsis text-nowrap flex-1 max-w-[70%]">
                    {item.headline}
                  </span>
                  <IconButton className="absolute right-0 ">
                    <Image
                      src={
                        !item.isDraft
                          ? "/icons/uploadGreen.svg"
                          : "/icons/draft.svg"
                      }
                      alt=""
                      width={20}
                      height={20}
                      className=""
                    />
                  </IconButton>
                </div>
              );
            })
          )}
        </div>
      </div>
      {selectedCampaign ? (
        <CampaignEdit
          selectedCampaign={selectedCampaign}
          refetch={refetch}
          setRefetch={setRefetch}
          setSelectedCampaign={setSelectedCampaign}
        />
      ) : createCampaignForm ? (
        <div className="min-w-[350px] border-[1px] border-[#d1d1d1] gap-4 flex-1 overflow-y-auto h-full hiddenscrollbar">
          <div className="h-[139px] w-full border-b-[1px] border-[#d1d1d1] lg:pr-[40px] md:pr-[40px] pr-[20px] pl-6 flex flex-row items-center">
            Creat New Campaign
          </div>
          <form
            onSubmit={handleSubmit(handleRegister)}
            className="relative flex-1 flex flex-col h-full p-10"
          >
            <div className="flex flex-col gap-4 text-titleColor h-full">
              <label>Headline</label>
              <TextField
                {...register("headline", { required: "required" })}
                variant="outlined"
                error={Boolean(!!errors.headline)}
                helperText={
                  !!errors.headline && errors.headline.message?.toString()
                }
                sx={{ backgroundColor: "white" }}
                inputProps={{ style: { padding: 10 } }}
              />
              <div className="flex flex-col gap-1 text-titleColor">
                <label>Headline in Amharic</label>
                <TextField
                  {...register("headlineAmharic", { required: "required" })}
                  variant="outlined"
                  error={Boolean(!!errors.headlineAmharic)}
                  helperText={
                    !!errors.headlineAmharic &&
                    errors.headlineAmharic.message?.toString()
                  }
                  sx={{ backgroundColor: "white" }}
                  inputProps={{ style: { padding: 10 } }}
                />
              </div>
              <div className="flex flex-col gap-1 text-titleColor">
                <label>CampaignLink</label>
                <TextField
                  {...register("campaignLink", { required: "required" })}
                  variant="outlined"
                  error={Boolean(!!errors.campaignLink)}
                  helperText={
                    !!errors.campaignLink &&
                    errors.campaignLink.message?.toString()
                  }
                  sx={{ backgroundColor: "white" }}
                  inputProps={{ style: { padding: 10 } }}
                />
              </div>
              <div className="flex xl:flex-row lg:flex-row md:flex-row flex-col items-center w-full gap-6">
                <div className="flex flex-col gap-1 text-titleColor w-full">
                  <label>Start Date</label>
                  <LocalizationProvider dateAdapter={AdapterDayjs}>
                    <DatePicker
                      {...register("startDate", {
                        required: "Start Date is required",
                      })}
                      onChange={(value) => setValue("startDate", value)}
                    />
                  </LocalizationProvider>
                  {errors.startDate && !watch("startDate") && (
                    <small className="text-red-500">
                      {errors?.startDate?.message?.toString()}
                    </small>
                  )}
                </div>
                <div className="flex flex-col gap-1 text-titleColor w-full">
                  <label>End Date</label>
                  <LocalizationProvider dateAdapter={AdapterDayjs}>
                    <DatePicker
                      {...register("endDate", {
                        required: "End Date is required",
                      })}
                      onChange={(value) => setValue("endDate", value)}
                    />
                  </LocalizationProvider>
                  {errors?.endDate && !watch("endDate") && (
                    <small className="text-red-500">
                      {errors?.endDate?.message?.toString()}
                    </small>
                  )}
                </div>
              </div>
              <div className="bottom-0 py-4 border-t-[1px] flex-row flex items-center justify-between gap-2 w-full">
                <div className="flex flex-row items-center gap-1">
                  <Checkbox {...register("isDraft")} />
                  <span>Save as Draft</span>
                </div>
                <Button
                  variant="contained"
                  type="submit"
                  className="flex flex-row items-center justify-center gap-2 shadow-none capitalize text-lg h-[48px]"
                >
                  {loading ? (
                    <CircularProgress />
                  ) : watch("isDraft") ? (
                    <span>Save Draft</span>
                  ) : (
                    <>
                      <Upload /> <span>Publish</span>
                    </>
                  )}
                </Button>
              </div>
            </div>
          </form>
        </div>
      ) : (
        <></>
      )}
    </div>
  );
};

export default Campaigns;
