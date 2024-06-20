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
import { Initiative } from "@prisma/client";
import axios from "axios";
import Image from "next/image";
import { useEffect, useState } from "react";
import { FieldValues, useForm } from "react-hook-form";
import { useDispatch } from "react-redux";

const InitiativeEdit = ({
  selectedInitiative,
  refetch,
  setRefetch,
  setSelectedInitiative,
}: {
  selectedInitiative: Initiative;
  refetch: boolean;
  setRefetch: (value: boolean) => void;
  setSelectedInitiative: (value: Initiative | undefined) => void;
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
    setValue("nameOfInitiative", selectedInitiative?.nameOfInitiative);
    setValue(
      "nameOfInitiativeAmharic",
      selectedInitiative?.nameOfInitiativeAmharic
    );
    setValue("body", selectedInitiative?.body);
    setValue("bodyAmharic", selectedInitiative?.bodyAmharic);
    setValue("featuredImages", selectedInitiative?.featuredImages);
    // setValue("isDraft", selectedInitiative?.isDraft);
  }, [selectedInitiative]);

  const handleUpdate = async (values: FieldValues) => {
    setLoading(true);
    try {
      const res = await axios.post(
        `/api/cms/initiative/edit/${selectedInitiative?.id}`,
        {
          ...values,
          featuredImages: ["/mike/new"],
        }
      );

      if (res?.status === 200) {
        dispatch(
          showToastAction({
            message: "Successfully Done",
            type: "success",
          })
        );
        reset();
        setSelectedInitiative(undefined);
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
        `/api/cms/initiative/delete/${selectedInitiative?.id}`
      );

      if (res?.status === 200) {
        dispatch(
          showToastAction({
            message: "Successfully Deleted",
            type: "success",
          })
        );
        reset();
        setSelectedInitiative(undefined);
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
        <span>Editing {selectedInitiative?.nameOfInitiative}</span>
        <IconButton onClick={() => setSelectedInitiative(undefined)}>
          <Close />
        </IconButton>
      </div>
      <form
        onSubmit={handleSubmit(handleUpdate)}
        className="relative flex-1 flex flex-col h-full p-10"
      >
        <div className="flex flex-col gap-4 text-fadeTextColor h-full">
          <label>Name of the intiative</label>
          <TextField
            {...register("nameOfInitiative")}
            variant="outlined"
            error={Boolean(!!errors.nameOfInitiative)}
            helperText={
              !!errors.nameOfInitiative &&
              errors.nameOfInitiative.message?.toString()
            }
            sx={{ backgroundColor: "white" }}
            inputProps={{ style: { padding: 10 } }}
          />
          <div className="flex flex-col gap-1 text-fadeTextColor">
            <label>Name of the intiative in Amharic</label>
            <TextField
              {...register("nameOfInitiativeAmharic")}
              variant="outlined"
              error={Boolean(!!errors.nameOfInitiativeAmharic)}
              helperText={
                !!errors.nameOfInitiativeAmharic &&
                errors.nameOfInitiativeAmharic.message?.toString()
              }
              sx={{ backgroundColor: "white" }}
              inputProps={{ style: { padding: 10 } }}
            />
          </div>
          <div className="flex flex-col gap-3 xl:col-span-1 md:col-span-2 sm:col-span-2">
            <span className="text-titleColor text-sm font-bold">
              Featured Images
            </span>
            <span className="relative flex flex-row items-center px-6 border-2 border-dashed rounded-[3px] py-2 cursor-pointer h-[65px]">
              <span className="flex flex-row items-center px-2 gap-2 text-titleColor cursor-pointer">
                <Image
                  src={"/icons/greyGallery.svg"}
                  alt=""
                  height={20}
                  width={20}
                />
                <span>
                  {watch("featuredImage") && watch("featuredImage")[0]?.name
                    ? watch("featuredImage")[0]?.name
                    : "Upload"}
                </span>
              </span>
              <input
                id="featuredImage"
                {...register("featuredImage", {
                  required: "featuredImage is required",
                  validate: {
                    fileSize: (value: any) => {
                      if (value && value[0]) {
                        return (
                          value[0].size < 1048576 ||
                          "File size must be less than 1MB"
                        );
                      }
                      return true;
                    },
                  },
                })}
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
            {/* <span className="text-[10px] text-titleColor">
            Image size must be 600*600 File size must be less than 1MB
          </span> */}
          </div>
          <Button
            variant="outlined"
            className="border-gray-500 w-full text-gray-500 capitalize"
          >
            + Add Items
          </Button>
          <div className="flex flex-col gap-1 text-fadeTextColor">
            <label>Body</label>
            <TextField
              {...register("body")}
              variant="outlined"
              multiline
              rows={4}
              error={Boolean(!!errors.body)}
              helperText={!!errors.body && errors.body.message?.toString()}
              sx={{ backgroundColor: "white" }}
              inputProps={{ style: { padding: 0 } }}
            />
          </div>
          <div className="flex flex-col gap-1 text-fadeTextColor">
            <label>Body in Amharic</label>
            <TextField
              {...register("bodyAmharic")}
              variant="outlined"
              multiline
              rows={4}
              error={Boolean(!!errors.bodyAmharic)}
              helperText={
                !!errors.bodyAmharic && errors.bodyAmharic.message?.toString()
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
              Are you sure you want to remove this Initiative?
            </span>
            <span className="capitalize flex flex-row items-center gap-2">
              <span>{selectedInitiative.nameOfInitiative}</span>
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
                  await handleDelete(selectedInitiative.id);
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

export default InitiativeEdit;
