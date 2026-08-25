import { showToastAction } from "@/redux/actions";
import { Upload } from "@mui/icons-material";
import { Button, Checkbox, CircularProgress, TextField } from "@mui/material";
import { AboutContent } from "@prisma/client";
import axios from "axios";
import Image from "next/image";
import { useEffect } from "react";
import { FieldValues, useForm } from "react-hook-form";
import { useDispatch } from "react-redux";

const IMAGE_SECTIONS = ["OUR_STORY", "CEO_MESSAGE"];

const AboutContentEdit = ({
  section,
  label,
  selectedContent,
  refetch,
  setRefetch,
}: {
  section: string;
  label: string;
  selectedContent?: AboutContent;
  refetch: boolean;
  setRefetch: (value: boolean) => void;
}) => {
  const dispatch = useDispatch();
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    watch,
    setValue,
  } = useForm();

  const isObjective = section === "OBJECTIVE";

  useEffect(() => {
    setValue("title", selectedContent?.title ?? "");
    setValue("titleAmharic", selectedContent?.titleAmharic ?? "");
    setValue("subtitle", selectedContent?.subtitle ?? "");
    setValue("subtitleAmharic", selectedContent?.subtitleAmharic ?? "");
    setValue(
      "body",
      isObjective
        ? (selectedContent?.items ?? []).join("\n")
        : selectedContent?.body ?? ""
    );
    setValue(
      "bodyAmharic",
      isObjective
        ? (selectedContent?.itemsAmharic ?? []).join("\n")
        : selectedContent?.bodyAmharic ?? ""
    );
    setValue("image", selectedContent?.image ?? "");
    setValue("isDraft", selectedContent?.isDraft ?? false);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [section, selectedContent]);

  const showImage = IMAGE_SECTIONS.includes(section);

  const handleUpdate = async (values: FieldValues) => {
    try {
      const formData = new FormData();
      formData.append("title", values.title ?? "");
      formData.append("titleAmharic", values.titleAmharic ?? "");
      formData.append("subtitle", values.subtitle ?? "");
      formData.append("subtitleAmharic", values.subtitleAmharic ?? "");
      if (isObjective) {
        formData.append("items", values.body ?? "");
        formData.append("itemsAmharic", values.bodyAmharic ?? "");
      } else {
        formData.append("body", values.body ?? "");
        formData.append("bodyAmharic", values.bodyAmharic ?? "");
      }
      formData.append("isDraft", values.isDraft);
      if (showImage) {
        formData.append(
          "image",
          typeof values.image === "string"
            ? values.image
            : values.image?.[0] ?? ""
        );
      }

      const res = await axios.post(`/api/cms/about/edit/${section}`, formData);

      if (res?.status === 200) {
        dispatch(
          showToastAction({
            message: "Successfully Done",
            type: "success",
          })
        );
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
        <span>Editing {label}</span>
      </div>

      <form
        onSubmit={handleSubmit(handleUpdate)}
        className="relative flex-1 flex flex-col h-full p-10"
      >
        <div className="flex flex-col gap-4 text-titleColor h-full">
          <label>{isObjective ? "Section Title" : "Title"}</label>
          <TextField
            {...register("title")}
            variant="outlined"
            sx={{ backgroundColor: "white" }}
            inputProps={{ style: { padding: 10 } }}
          />
          <label>{isObjective ? "Section Title (Amharic)" : "Title (Amharic)"}</label>
          <TextField
            {...register("titleAmharic")}
            variant="outlined"
            sx={{ backgroundColor: "white" }}
            inputProps={{ style: { padding: 10 } }}
          />

          {section === "CEO_MESSAGE" && (
            <>
              <label>Subtitle (e.g. date)</label>
              <TextField
                {...register("subtitle")}
                variant="outlined"
                sx={{ backgroundColor: "white" }}
                inputProps={{ style: { padding: 10 } }}
              />
              <label>Subtitle (Amharic)</label>
              <TextField
                {...register("subtitleAmharic")}
                variant="outlined"
                sx={{ backgroundColor: "white" }}
                inputProps={{ style: { padding: 10 } }}
              />
            </>
          )}

          {showImage && (
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
                  {...register("image", {
                    validate: {
                      fileSize: (value: any) => {
                        if (!(typeof value === "string") && value && value[0]) {
                          if (value[0].size > 1048576) {
                            dispatch(
                              showToastAction({
                                message: `Image size must be less than 1MB`,
                                type: "error",
                              })
                            );
                            return "Image size must be less than 1MB";
                          }
                          return value[0].size < 1048576;
                        }
                        return true;
                      },
                    },
                  })}
                  accept="image/*"
                  type="file"
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
              <span className="text-xs text-red-500">
                {errors.image && errors.image.message?.toString()}
              </span>
            </div>
          )}

          <div className="flex flex-col gap-1 text-titleColor">
            <label>{isObjective ? "One item per line" : "Body"}</label>
            <TextField
              {...register("body")}
              variant="outlined"
              multiline
              minRows={isObjective ? 10 : 6}
              sx={{ backgroundColor: "white" }}
              inputProps={{ style: { padding: 0 } }}
            />
          </div>
          <div className="flex flex-col gap-1 text-titleColor">
            <label>
              {isObjective ? "One item per line (Amharic)" : "Body (Amharic)"}
            </label>
            <TextField
              {...register("bodyAmharic")}
              variant="outlined"
              multiline
              minRows={isObjective ? 10 : 6}
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
            <Button
              variant="contained"
              type="submit"
              className="flex flex-row items-center justify-center gap-2 shadow-none capitalize text-lg h-[48px]"
            >
              {isSubmitting ? (
                <CircularProgress className="text-white" size={24} />
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
  );
};

export default AboutContentEdit;
