import { showToastAction } from "@/redux/actions";
import { Close, Delete, Upload } from "@mui/icons-material";
import {
  Avatar,
  Button,
  Checkbox,
  CircularProgress,
  Dialog,
  IconButton,
  TextField,
} from "@mui/material";
import { Management } from "@prisma/client";
import axios from "axios";
import Image from "next/image";
import { useEffect, useState } from "react";
import { FieldValues, useForm } from "react-hook-form";
import { useDispatch } from "react-redux";

const ManagementEdit = ({
  selectedManagement,
  refetch,
  setRefetch,
  setSelectedManagement,
}: {
  selectedManagement: Management;
  refetch: boolean;
  setRefetch: (value: boolean) => void;
  setSelectedManagement: (value: Management | undefined) => void;
}) => {
  const dispatch = useDispatch();
  const [loading, setLoading] = useState(false);
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);
  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
    watch,
    setValue,
    getValues,
  } = useForm();

  useEffect(() => {
    setValue("managerName", selectedManagement?.managerName);
    setValue("managerNameAmharic", selectedManagement?.managerNameAmharic);
    setValue("bio", selectedManagement?.bio);
    setValue("bioAmharic", selectedManagement?.bioAmharic);
    setValue("job", selectedManagement?.job);
    setValue("jobAmharic", selectedManagement?.jobAmharic);
    setValue("photo", selectedManagement?.photo);
    setValue("isDraft", selectedManagement?.isDraft);
    setValue("isBoardMember", selectedManagement?.isBoardMember);
  }, [selectedManagement]);

  const handleUpdate = async (values: FieldValues) => {
    setLoading(true);
    try {
      const formData = new FormData();
      formData.append("managerName", values.managerName);
      formData.append("managerNameAmharic", values.managerNameAmharic);
      formData.append("job", values.job);
      formData.append("jobAmharic", values.jobAmharic);
      formData.append(
        "photo",
        typeof values.photo === "string" ? values.photo : values.photo[0]
      );
      formData.append("bio", values.bio);
      formData.append("bioAmharic", values.bioAmharic);
      formData.append("isDraft", values.isDraft);
      formData.append("isBoardMember", values.isBoardMember);

      const res = await axios.post(
        `/api/cms/management/edit/${selectedManagement?.id}`,
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
        setSelectedManagement(undefined);
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
        `/api/cms/management/delete/${selectedManagement?.id}`
      );

      if (res?.status === 200) {
        dispatch(
          showToastAction({
            message: "Successfully Deleted",
            type: "success",
          })
        );
        reset();
        setSelectedManagement(undefined);
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
        <span>Editing {selectedManagement?.managerName}</span>
        <IconButton onClick={() => setSelectedManagement(undefined)}>
          <Close />
        </IconButton>
      </div>

      <form
        onSubmit={handleSubmit(handleUpdate)}
        className="relative flex-1 flex flex-col h-full p-10"
      >
        <div className="flex flex-col gap-4 text-titleColor h-full">
          <label>Manager Name</label>
          <TextField
            {...register("managerName", { required: "required" })}
            variant="outlined"
            error={Boolean(!!errors.managerName)}
            helperText={
              !!errors.managerName && errors.managerName.message?.toString()
            }
            sx={{ backgroundColor: "white" }}
            inputProps={{ style: { padding: 10 } }}
          />
          <div className="flex flex-col gap-1 text-titleColor">
            <label>Manager Name in Amharic</label>
            <TextField
              {...register("managerNameAmharic", { required: "required" })}
              variant="outlined"
              error={Boolean(!!errors.managerNameAmharic)}
              helperText={
                !!errors.managerNameAmharic &&
                errors.managerNameAmharic.message?.toString()
              }
              sx={{ backgroundColor: "white" }}
              inputProps={{ style: { padding: 10 } }}
            />
          </div>
          <div className="flex flex-col gap-1 text-titleColor">
            <label>Job Title</label>
            <TextField
              {...register("job", { required: "required" })}
              variant="outlined"
              error={Boolean(!!errors.job)}
              helperText={!!errors.job && errors.job.message?.toString()}
              sx={{ backgroundColor: "white" }}
              inputProps={{ style: { padding: 10 } }}
            />
          </div>
          <div className="flex flex-col gap-1 text-titleColor">
            <label>Job Title in Amharic</label>
            <TextField
              {...register("jobAmharic", { required: "required" })}
              variant="outlined"
              error={Boolean(!!errors.jobAmharic)}
              helperText={
                !!errors.jobAmharic && errors.jobAmharic.message?.toString()
              }
              sx={{ backgroundColor: "white" }}
              inputProps={{ style: { padding: 10 } }}
            />
          </div>
          <div className="flex flex-col gap-3 xl:col-span-1 md:col-span-2 sm:col-span-2">
            <span className="text-titleColor text-sm font-bold">Photo</span>
            <span className="relative flex flex-row items-center px-6 border-2 border-dashed rounded-[3px] py-2 cursor-pointer h-[65px]">
              <span className="flex flex-row items-center px-2 gap-2 text-titleColor cursor-pointer">
                <Image
                  src={"/icons/greyGallery.svg"}
                  alt=""
                  height={20}
                  width={20}
                />
                <span>
                  {typeof watch("photo") === "string"
                    ? watch("photo").slice(0, 40)
                    : watch("photo")?.[0]?.name
                    ? watch("photo")?.[0]?.name
                    : "Upload"}
                </span>
              </span>
              <input
                id="photo"
                {...register("photo")}
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
            {false && (
              <span className="text-[10px] text-titleColor">
                Image size must be 600*600 File size must be less than 1MB
              </span>
            )}
          </div>
          <div className="flex flex-col gap-1 text-titleColor">
            <label>Bio</label>
            <TextField
              {...register("bio")}
              variant="outlined"
              multiline
              rows={4}
              error={Boolean(!!errors.bio)}
              helperText={!!errors.bio && errors.bio.message?.toString()}
              sx={{ backgroundColor: "white" }}
              inputProps={{ style: { padding: 0 } }}
            />
          </div>
          <div className="flex flex-col gap-1 text-titleColor">
            <label>Bio in Amharic</label>
            <TextField
              {...register("bioAmharic")}
              variant="outlined"
              multiline
              rows={4}
              error={Boolean(!!errors.bioAmharic)}
              helperText={
                !!errors.bioAmharic && errors.bioAmharic.message?.toString()
              }
              sx={{ backgroundColor: "white" }}
              inputProps={{ style: { padding: 0 } }}
            />
          </div>
          <div className="flex flex-row items-center gap-1 text-titleColor">
            <Checkbox
              {...register("isBoardMember")}
              checked={Boolean(watch("isBoardMember"))}
            />
            <span>Board Member</span>
          </div>
          <div className="py-4 border-t-[1px] flex-row flex items-center justify-between gap-2 w-full">
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
                  <CircularProgress className="text-white" />
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
              Are you sure you want to remove this Management?
            </span>
            <span className="capitalize flex flex-row items-center gap-2">
              <span>{selectedManagement.managerName}</span>
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
                  await handleDelete(selectedManagement.id);
                }}
              >
                Remove
              </Button>
            </div>
          </div>
        </div>
      </Dialog>
    </div>
  );
};

export default ManagementEdit;
