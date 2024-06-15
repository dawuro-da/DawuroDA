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
import { Job } from "@prisma/client";
import axios from "axios";
import Image from "next/image";
import { useEffect, useState } from "react";
import { FieldValues, useForm } from "react-hook-form";
import { useDispatch } from "react-redux";

const JobEdit = ({
  selectedJob,
  refetch,
  setRefetch,
  setSelectedJob,
}: {
  selectedJob: Job;
  refetch: boolean;
  setRefetch: (value: boolean) => void;
  setSelectedJob: (value: Job | undefined) => void;
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
  } = useForm();

  useEffect(() => {
    setValue("jobTitle", selectedJob?.jobTitle);
    setValue("jobTitleAmharic", selectedJob?.jobTitleAmharic);
    setValue("jobDescription", selectedJob?.jobDescription);
    setValue("jobDescriptionAmharic", selectedJob?.jobDescriptionAmharic);
    // setValue("isDraft", selectedJob?.isDraft);
  }, [selectedJob]);

  const handleUpdate = async (values: FieldValues) => {
    setLoading(true);
    try {
      const res = await axios.post(`/api/cms/event/edit/${selectedJob?.id}`, {
        ...values,
        profileImage: "/mike/new",
      });

      if (res?.status === 200) {
        dispatch(
          showToastAction({
            message: "Successfully Done",
            type: "success",
          })
        );
        reset();
        setSelectedJob(undefined);
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
        `/api/cms/event/delete/${selectedJob?.id}`
      );

      if (res?.status === 200) {
        dispatch(
          showToastAction({
            message: "Successfully Deleted",
            type: "success",
          })
        );
        reset();
        setSelectedJob(undefined);
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
    <div className="border-[1px] border-[#d1d1d1] gap-4 flex-1 overflow-y-auto h-full hiddenscrollbar">
      <div className="h-[139px] w-full border-b-[1px] border-[#d1d1d1] lg:pr-[40px] md:pr-[40px] pr-[20px] pl-6 flex flex-row items-center justify-between">
        <span>Editing {selectedJob?.jobTitle}</span>
        <IconButton onClick={() => setSelectedJob(undefined)}>
          <Close />
        </IconButton>
      </div>
      <form
        onSubmit={handleSubmit(handleUpdate)}
        className="relative flex-1 flex flex-col h-full p-10"
      >
        <div className="flex flex-col gap-4 text-fadeTextColor h-full">
          <label>Job Title</label>
          <TextField
            {...register("jobTitle")}
            variant="outlined"
            error={Boolean(!!errors.jobTitle)}
            helperText={
              !!errors.jobTitle && errors.jobTitle.message?.toString()
            }
            sx={{ backgroundColor: "white" }}
            inputProps={{ style: { padding: 10 } }}
          />
          <div className="flex flex-col gap-1 text-fadeTextColor">
            <label>Job Title in Amharic</label>
            <TextField
              {...register("jobTitleAmharic")}
              variant="outlined"
              error={Boolean(!!errors.jobTitleAmharic)}
              helperText={
                !!errors.jobTitleAmharic &&
                errors.jobTitleAmharic.message?.toString()
              }
              sx={{ backgroundColor: "white" }}
              inputProps={{ style: { padding: 10 } }}
            />
          </div>

          <div className="flex flex-col gap-1 text-fadeTextColor">
            <label>Job Description</label>
            <TextField
              {...register("jobDescription")}
              variant="outlined"
              multiline
              rows={4}
              error={Boolean(!!errors.jobDescription)}
              helperText={
                !!errors.jobDescription &&
                errors.jobDescription.message?.toString()
              }
              sx={{ backgroundColor: "white" }}
              inputProps={{ style: { padding: 0 } }}
            />
          </div>
          <div className="flex flex-col gap-1 text-fadeTextColor">
            <label>Job Description in Amharic</label>
            <TextField
              {...register("jobDescriptionAmharic")}
              variant="outlined"
              multiline
              rows={4}
              error={Boolean(!!errors.jobDescriptionAmharic)}
              helperText={
                !!errors.jobDescriptionAmharic &&
                errors.jobDescriptionAmharic.message?.toString()
              }
              sx={{ backgroundColor: "white" }}
              inputProps={{ style: { padding: 0 } }}
            />
          </div>
          <div className="py-4 border-t-[1px] flex-row flex items-center justify-between gap-2 w-full">
            <div className="flex flex-row items-center gap-1">
              <Checkbox {...register("isDraft")} checked={Boolean(watch("isDraft"))}/>
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
              Are you sure you want to remove this Job?
            </span>
            <span className="capitalize flex flex-row items-center gap-2">
              <span>{selectedJob.jobTitle}</span>
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
                  await handleDelete(selectedJob.id);
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

export default JobEdit;
