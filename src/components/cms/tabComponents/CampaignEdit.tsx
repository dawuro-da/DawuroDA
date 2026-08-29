import { showToastAction } from "@/redux/actions";
import { Close, Delete, Upload } from "@mui/icons-material";
import {
  Button,
  Checkbox,
  CircularProgress,
  Dialog,
  IconButton,
  TextField,
} from "@mui/material";
import { DatePicker, LocalizationProvider } from "@mui/x-date-pickers";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { Campaign } from "@prisma/client";
import axios from "axios";
import dayjs from "dayjs";
import Image from "next/image";
import { useEffect, useState } from "react";
import { FieldValues, useForm } from "react-hook-form";
import { useDispatch } from "react-redux";
import RecordDonationDialog from "./RecordDonationDialog";

const CampaignEdit = ({
  selectedCampaign,
  refetch,
  setRefetch,
  setSelectedCampaign,
}: {
  selectedCampaign: Campaign;
  refetch: boolean;
  setRefetch: (value: boolean) => void;
  setSelectedCampaign: (value: Campaign | undefined) => void;
}) => {
  const dispatch = useDispatch();
  const [loading, setLoading] = useState(false);
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);
  const [showRecordDonation, setShowRecordDonation] = useState(false);
  const [raisedAmount, setRaisedAmount] = useState(
    selectedCampaign?.raisedAmount ?? 0
  );
  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
    watch,
    setValue,
  } = useForm();

  useEffect(() => {
    setValue("headline", selectedCampaign?.headline);
    setValue("headlineAmharic", selectedCampaign?.headlineAmharic);
    setValue("description", selectedCampaign?.description);
    setValue("descriptionAmharic", selectedCampaign?.descriptionAmharic);
    setValue("image", selectedCampaign?.image);
    setValue("youtubeLink", selectedCampaign?.youtubeLink);
    setValue("goalAmount", selectedCampaign?.goalAmount);
    setRaisedAmount(selectedCampaign?.raisedAmount ?? 0);
    setValue("isFeatured", selectedCampaign?.isFeatured);
    setValue("isDraft", selectedCampaign?.isDraft);
  }, [selectedCampaign]);

  const handleUpdate = async (values: FieldValues) => {
    setLoading(true);
    try {
      const formData = new FormData();
      formData.append("headline", values.headline);
      formData.append("headlineAmharic", values.headlineAmharic);
      formData.append("description", values.description);
      formData.append("descriptionAmharic", values.descriptionAmharic ?? "");
      formData.append(
        "image",
        typeof values.image === "string"
          ? values.image
          : values.image?.[0] ?? ""
      );
      formData.append("youtubeLink", values.youtubeLink ?? "");
      formData.append("goalAmount", values.goalAmount ?? "");
      formData.append("isFeatured", values.isFeatured ?? false);
      formData.append("isDraft", values.isDraft ?? false);
      formData.append("startDate", values.startDate);
      formData.append("endDate", values.endDate);

      const res = await axios.post(
        `/api/cms/campaign/edit/${selectedCampaign?.id}`,
        formData
      );

      if (res?.status === 200) {
        dispatch(
          showToastAction({
            message: "Successfully Done",
            type: "success",
          })
        );
        reset();
        setSelectedCampaign(undefined);
        setRefetch(!refetch);
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

  const handleDelete = async (id: string) => {
    try {
      const res = await axios.delete(
        `/api/cms/campaign/delete/${selectedCampaign?.id}`
      );

      if (res?.status === 200) {
        dispatch(
          showToastAction({
            message: "Successfully Deleted",
            type: "success",
          })
        );
        reset();
        setSelectedCampaign(undefined);
        setRefetch(!refetch);
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
  };

  return (
    <div className="min-w-[350px] border-[1px] border-[#d1d1d1] gap-4 flex-1 overflow-y-auto h-full hiddenscrollbar">
      <div className="h-[139px] w-full border-b-[1px] border-[#d1d1d1] lg:pr-[40px] md:pr-[40px] pr-[20px] pl-6 flex flex-row items-center justify-between">
        <span>Editing {selectedCampaign?.headline}</span>
        <IconButton onClick={() => setSelectedCampaign(undefined)}>
          <Close />
        </IconButton>
      </div>
      <form
        onSubmit={handleSubmit(handleUpdate)}
        className="relative flex-1 flex flex-col h-full p-10"
      >
        <div className="relative flex flex-col gap-4 text-titleColor h-full">
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
            <label>Description</label>
            <TextField
              {...register("description")}
              variant="outlined"
              error={Boolean(!!errors.description)}
              helperText={
                !!errors.description && errors.description.message?.toString()
              }
              sx={{ backgroundColor: "white" }}
              inputProps={{ style: { padding: 10 } }}
            />
          </div>
          <div className="flex flex-col gap-1 text-titleColor">
            <label>Description in Amharic</label>
            <TextField
              {...register("descriptionAmharic")}
              variant="outlined"
              error={Boolean(!!errors.descriptionAmharic)}
              helperText={
                !!errors.descriptionAmharic &&
                errors.descriptionAmharic.message?.toString()
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
                  defaultValue={dayjs(watch("startDate"))}
                  onChange={(value) =>
                    setValue("startDate", value?.toDate() ?? new Date())
                  }
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
                  defaultValue={dayjs(watch("endDate"))}
                  onChange={(value) =>
                    setValue("endDate", value?.toDate() ?? new Date())
                  }
                />
              </LocalizationProvider>
              {errors?.endDate && !watch("endDate") && (
                <small className="text-red-500">
                  {errors?.endDate?.message?.toString()}
                </small>
              )}
            </div>
          </div>

          <div className="flex flex-col gap-3">
            <span className="text-titleColor text-sm font-bold">Image</span>
            <span className="relative flex flex-row items-center px-6 border-2 border-dashed rounded-[3px] py-2 cursor-pointer h-[65px]">
              <span className="flex flex-row items-center px-2 gap-2 text-titleColor cursor-pointer">
                <Image
                  src={"/icons/greyGallery.svg"}
                  alt=""
                  height={20}
                  width={20}
                />
                <span>
                  {typeof watch("image") === "string"
                    ? watch("image")?.slice(0, 40)
                    : watch("image")?.[0]?.name
                    ? watch("image")?.[0]?.name
                    : "Upload"}
                </span>
              </span>
              <input
                id="image"
                {...register("image")}
                accept="image/*"
                type="file"
                placeholder=""
                className="z-10 absolute inset-0 w-full h-full opacity-0 cursor-pointer"
              />
              <Button className="flex flex-row items-center justify-center outline-none z-0 gap-2 absolute bg-white text-titleColor right-4 px-4 py-2 cursor-pointer">
                <Image
                  src={"/icons/uploadIcon.svg"}
                  alt=""
                  height={20}
                  width={20}
                />
                <span>Upload</span>
              </Button>
            </span>
          </div>

          <div className="flex flex-col gap-1 text-titleColor">
            <label>YouTube Link (optional)</label>
            <TextField
              {...register("youtubeLink")}
              variant="outlined"
              placeholder="https://www.youtube.com/watch?v=..."
              sx={{ backgroundColor: "white" }}
              inputProps={{ style: { padding: 10 } }}
            />
          </div>

          <div className="flex xl:flex-row lg:flex-row md:flex-row flex-col items-center w-full gap-6">
            <div className="flex flex-col gap-1 text-titleColor w-full">
              <label>Goal Amount (Birr)</label>
              <TextField
                {...register("goalAmount")}
                type="number"
                variant="outlined"
                sx={{ backgroundColor: "white" }}
                inputProps={{ style: { padding: 10 } }}
              />
            </div>
            <div className="flex flex-col gap-1 text-titleColor w-full">
              <label>Raised Amount (Birr)</label>
              <div className="flex flex-row items-center gap-3">
                <div className="bg-gray-50 border border-gray-200 rounded-lg px-4 py-2.5 font-semibold flex-1">
                  {raisedAmount.toLocaleString()} ETB
                </div>
                <Button
                  type="button"
                  variant="outlined"
                  onClick={() => setShowRecordDonation(true)}
                  className="capitalize whitespace-nowrap"
                >
                  Record Donation
                </Button>
              </div>
              <small className="text-titleColor opacity-70">
                Driven by real donations (online or manually recorded) — not
                directly editable.
              </small>
            </div>
          </div>

          <div className="flex flex-row items-center gap-1">
            <Checkbox
              {...register("isFeatured")}
              checked={Boolean(watch("isFeatured"))}
            />
            <span>Featured Campaign (shown in the hero-style section)</span>
          </div>

          <div className=" bottom-0 py-4 border-t-[1px] flex-row flex items-center justify-between gap-2 w-full">
            <div className="flex flex-row items-center gap-1">
              <Checkbox
                {...register("isDraft")}
                checked={Boolean(watch("isDraft"))}
              />
              <span>Save as Draft</span>
            </div>
            <div className="flex flex-row items-center gap-1">
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
              <div className="border-l-[2px] ">
                <IconButton onClick={() => setShowDeleteDialog(true)}>
                  <Delete />
                </IconButton>
              </div>
            </div>
          </div>
        </div>
      </form>
      <Dialog
        open={Boolean(showDeleteDialog)}
        onClose={() => setShowDeleteDialog(false)}
      >
        <div className="flex flex-col items-center max-w-[600px] p-6">
          <div className="w-full flex flex-row justify-end">
            <Close
              onClick={() => {
                setShowDeleteDialog(false);
              }}
              className="cursor-pointer"
            />
          </div>
          <div className="flex flex-col items-center gap-6 px-12 py-6">
            <span className="font-bold text-3xl">
              Are you sure you want to remove this Campaign?
            </span>
            <span className="capitalize flex flex-row items-center gap-2">
              <span>{selectedCampaign.headline}</span>
            </span>
            <div className="flex flex-row gap-6 items-center mt-10">
              <Button
                variant="outlined"
                className="text-black border-black"
                onClick={() => setShowDeleteDialog(false)}
              >
                Cancel
              </Button>
              <Button
                variant="outlined"
                className="bg-red-700 border-red-700 hover:bg-red-700 hover:border-red-700 text-white"
                onClick={async () => {
                  await handleDelete(selectedCampaign.id);
                }}
              >
                Remove
              </Button>
            </div>
          </div>
        </div>
      </Dialog>
      <RecordDonationDialog
        open={showRecordDonation}
        onClose={() => setShowRecordDonation(false)}
        campaign={selectedCampaign}
        onRecorded={(amount) => {
          setRaisedAmount((prev) => prev + amount);
          setRefetch(!refetch);
        }}
      />
    </div>
  );
};

export default CampaignEdit;
