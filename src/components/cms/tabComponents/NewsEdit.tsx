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
import { News } from "@prisma/client";
import axios from "axios";
import Image from "next/image";
import { useEffect, useState } from "react";
import { FieldValues, useFieldArray, useForm } from "react-hook-form";
import { useDispatch } from "react-redux";

const NewsEdit = ({
  selectedNews,
  refetch,
  setRefetch,
  setSelectedNews,
}: {
  selectedNews: News;
  refetch: boolean;
  setRefetch: (value: boolean) => void;
  setSelectedNews: (value: News | undefined) => void;
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
    control,
  } = useForm();
  const { fields, append, remove } = useFieldArray({
    control,
    name: "profileImage",
  });

  useEffect(() => {
    setValue("headline", selectedNews?.headline);
    setValue("headlineAmharic", selectedNews?.headlineAmharic);
    setValue("youtubeLink", selectedNews?.youtubeLink);
    setValue("body", selectedNews?.body);
    setValue("bodyAmharic", selectedNews?.bodyAmharic);
    setValue("profileImage", selectedNews?.profileImage);
    setValue("isDraft", selectedNews?.isDraft);
  }, [selectedNews]);

  const handleUpdate = async (values: FieldValues) => {
    setLoading(true);
    const {
      profileImage,
      headline,
      headlineAmharic,
      youtubeLink,
      body,
      bodyAmharic,
      isDraft,
    } = values;
    const formData = new FormData();
    for (let k = 0; k < profileImage.length; k++) {
      if (typeof profileImage[k] === "string") {
        formData.append("profileImage", profileImage[k]);
      } else {
        formData.append("profileImage", profileImage[k][0]);
      }
    }
    formData.append("headline", headline);
    formData.append("headlineAmharic", headlineAmharic);
    formData.append("youtubeLink", youtubeLink);
    formData.append("body", body);
    formData.append("bodyAmharic", bodyAmharic);
    formData.append("isDraft", isDraft);

    try {
      const res = await axios.post(
        `/api/cms/news/edit/${selectedNews?.id}`,
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
        setSelectedNews(undefined);
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
        `/api/cms/news/delete/${selectedNews?.id}`
      );

      if (res?.status === 200) {
        dispatch(
          showToastAction({
            message: "Successfully Deleted",
            type: "success",
          })
        );
        reset();
        setSelectedNews(undefined);
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
        <span>Editing {selectedNews?.headline}</span>
        <IconButton onClick={() => setSelectedNews(undefined)}>
          <Close />
        </IconButton>
      </div>
      <form
        onSubmit={handleSubmit(handleUpdate)}
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
          {fields.map((field, index) => (
            <div
              key={field.id}
              className="flex flex-col gap-3 xl:col-span-1 md:col-span-2 sm:col-span-2"
            >
              {index === 0 && (
                <span className="text-titleColor text-sm font-bold">
                  Images
                </span>
              )}
              <span className="flex flex-row gap-1">
                <span className="flex-1 relative flex flex-row items-center px-6 border-2 border-dashed rounded-[3px] py-2 cursor-pointer h-[65px]">
                  <span className="flex flex-row items-center px-2 gap-2 text-titleColor cursor-pointer">
                    <Image
                      src={"/icons/greyGallery.svg"}
                      alt=""
                      height={20}
                      width={20}
                    />
                    <span>
                      {typeof watch("profileImage")?.[index] === "string"
                        ? watch("profileImage")?.[index].slice(0, 40)
                        : watch("profileImage")?.[index][0]?.name
                        ? watch("profileImage")?.[index][0]?.name
                        : "Upload"}
                    </span>
                  </span>
                  <input
                    id="profileImage"
                    {...register(`profileImage.${index}`, {
                      validate: {
                        fileSize: (value: any) => {
                          if (
                            !(typeof value === "string") &&
                            value &&
                            value[0]
                          ) {
                            if (value[0].size > 1048576) {
                              dispatch(
                                showToastAction({
                                  message: `Image ${
                                    index + 1
                                  } size must be less than 1MB`,
                                  type: "error",
                                })
                              );
                              return "Image size must be less than 1MB";
                            } else {
                              return value[0].size < 1048576;
                            }
                          }
                          return true;
                        },
                      },
                    })}
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
                {fields.length > 1 && (
                  <IconButton onClick={() => remove(index)}>
                    <Close />
                  </IconButton>
                )}
              </span>
              {/* <span className="text-[10px] text-titleColor">
                  Image size must be 600*600 File size must be less than 1MB
                </span> */}
            </div>
          ))}
          <Button
            onClick={append}
            variant="outlined"
            className="border-gray-500 w-full text-gray-500 capitalize"
          >
            + Add Items
          </Button>
          <div className="flex flex-col gap-1 text-titleColor">
            <label>Youtube Link</label>
            <TextField
              {...register("youtubeLink")}
              variant="outlined"
              error={Boolean(!!errors.youtubeLink)}
              helperText={
                !!errors.youtubeLink && errors.youtubeLink.message?.toString()
              }
              sx={{ backgroundColor: "white" }}
              inputProps={{ style: { padding: 10 } }}
            />
          </div>
          <div className="flex flex-col gap-1 text-titleColor">
            <label>Body</label>
            <TextField
              {...register("body", {
                required: "Body is required",
              })}
              variant="outlined"
              multiline
              rows={4}
              error={Boolean(!!errors.body)}
              helperText={!!errors.body && errors.body.message?.toString()}
              sx={{ backgroundColor: "white" }}
              inputProps={{ style: { padding: 0 } }}
            />
          </div>
          <div className="flex flex-col gap-1 text-titleColor">
            <label>Body in Amharic</label>
            <TextField
              {...register("bodyAmharic", {
                required: "Body in Amharic is required",
              })}
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
              Are you sure you want to remove this News?
            </span>
            <span className="capitalize flex flex-row items-center gap-2">
              <span>{selectedNews.headline}</span>
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
                  await handleDelete(selectedNews.id);
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

export default NewsEdit;
