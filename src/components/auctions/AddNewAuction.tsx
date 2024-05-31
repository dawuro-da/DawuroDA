"use client";

import { Button, CircularProgress, TextField } from "@mui/material";
import PageHeader from "../shared/PageHeader";
import { useRouter } from "next/navigation";
import { getFormattedDate } from "@/util/date";
import Image from "next/image";
import { ArrowBack } from "@mui/icons-material";
import { useForm } from "react-hook-form";
import { DatePicker, LocalizationProvider } from "@mui/x-date-pickers";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { useState } from "react";

const AddNewAuction = () => {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
    setValue,
    watch,
  } = useForm();
  return (
    <div className="h-full w-full overflow-y-auto text-titleColor">
      <PageHeader />
      <div className="lg:px-[40px] md:px-[40px] px-[20px] py-10 w-full flex flex-col flex-1 ">
        <div className="flex xl:lg:flex-row md:flex-row flex-col xl:lg:items-center md:items-center justify-between gap-2">
          <div
            onClick={() => {
              router.push("/admin/dashboard/auction");
            }}
            className="flex flex-row items-center gap-2 cursor-pointer"
          >
            <ArrowBack />
            <span className="text-titleColor text-sm">Back to Auctions</span>
          </div>
        </div>
        <div className="flex flex-col items-center justify-center mt-10">
          <span className="w-full max-w-[700px]">
            <span className="text-titleColor font-bold text-3xl">New Bid</span>
          </span>
          <div className="flex flex-col w-full gap-6 mt-3 max-w-[700px]">
            <div className="flex flex-col gap-4 text-fadeTextColor h-full">
              <label>Title</label>
              <TextField
                {...register("title")}
                variant="outlined"
                error={Boolean(!!errors.title)}
                helperText={!!errors.title && errors.title.message?.toString()}
                inputProps={{ style: { padding: 10 } }}
              />
            </div>
            <div className="flex xl:flex-row lg:flex-row md:flex-row flex-col items-center w-full gap-6">
              <div className="flex flex-col gap-1 text-fadeTextColor w-full">
                <label>Start Date</label>
                <LocalizationProvider dateAdapter={AdapterDayjs}>
                  <DatePicker
                    onChange={(value) => setValue("startDate", value)}
                  />
                </LocalizationProvider>
              </div>
              <div className="flex flex-col gap-1 text-fadeTextColor w-full">
                <label>End Date</label>
                <LocalizationProvider dateAdapter={AdapterDayjs}>
                  <DatePicker
                    onChange={(value) => setValue("endDate", value)}
                  />
                </LocalizationProvider>
              </div>
            </div>
            <div className="flex flex-col gap-3 xl:col-span-1 md:col-span-2 sm:col-span-2">
              <span className="text-titleColor text-sm font-bold">
                CPO File
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
                    {watch("cpoFile") && watch("cpoFile")[0]?.name
                      ? watch("cpoFile")[0]?.name
                      : "Upload"}
                  </span>
                </span>
                <input
                  id="cpoFile"
                  {...register("cpoFile", {
                    required: "cpoFile is required",
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
              </span> */}{" "}
              <div className="flex flex-col gap-4 text-fadeTextColor h-full">
                <label>Body</label>
                <TextField
                  {...register("body")}
                  variant="outlined"
                  multiline
                  rows={6}
                  error={Boolean(!!errors.body)}
                  helperText={!!errors.body && errors.body.message?.toString()}
                  inputProps={{ style: { padding: 0 } }}
                />
              </div>
              <Button
                type="submit"
                variant="contained"
                className="bg-primaryColor text-white px-10 py-4 font-bold w-[250px] h-[60px]"
              >
                {loading ? (
                  <CircularProgress className="text-white" />
                ) : (
                  "Post Bid"
                )}
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AddNewAuction;
