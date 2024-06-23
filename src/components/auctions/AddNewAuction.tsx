"use client";

import { Button, Checkbox, CircularProgress, TextField } from "@mui/material";
import PageHeader from "../shared/PageHeader";
import { useRouter } from "next/navigation";
import Image from "next/image";
import { ArrowBack } from "@mui/icons-material";
import { FieldValues, useForm } from "react-hook-form";
import { DatePicker, LocalizationProvider } from "@mui/x-date-pickers";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { useState } from "react";
import { showToastAction } from "@/redux/actions";
import axios from "axios";
import { useDispatch } from "react-redux";

const AddNewAuction = () => {
  const router = useRouter();
  const dispatch = useDispatch();
  const [loading, setLoading] = useState(false);
  const {
    register,
    handleSubmit,
    formState: { errors },
    setValue,
    watch,
  } = useForm();

  const handleRegister = async (values: FieldValues) => {
    setLoading(true);
    try {
      const formData = new FormData();
      formData.append("title", values.title);
      formData.append("description", values.description);
      formData.append("CPO", values.CPO);
      formData.append("formPayment", values.formPayment);
      formData.append("isPurchasing", values.isPurchasing);
      formData.append(
        "formFile",
        typeof values.formFile === "string"
          ? values.formFile
          : values.formFile[0]
      );
      formData.append("startDate", values.startDate);
      formData.append("endDate", values.endDate);

      const res = await axios.post("/api/auction/create", formData);

      if (res?.status === 200) {
        dispatch(
          showToastAction({
            message: "Successfully Created",
            type: "success",
          })
        );
        router.push("/admin/dashboard/auction");
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
        <form
          onSubmit={handleSubmit(handleRegister)}
          className="flex flex-col items-center justify-center mt-10"
        >
          <span className="w-full max-w-[700px]">
            <span className="text-titleColor font-bold text-3xl">
              Create New Auction
            </span>
          </span>
          <div className="flex flex-col w-full gap-6 mt-3 max-w-[700px]">
            <div className="flex flex-col gap-4 text-titleColor h-full">
              <label>Title</label>
              <TextField
                {...register("title", { required: "Title is required" })}
                variant="outlined"
                error={Boolean(!!errors.title)}
                helperText={!!errors.title && errors.title.message?.toString()}
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
            <div className="flex flex-col gap-4 text-titleColor h-full">
              <label>CPO </label>
              <TextField
                {...register("CPO", { required: "CPO is required" })}
                variant="outlined"
                type="number"
                error={Boolean(!!errors.CPO)}
                helperText={!!errors.CPO && errors.CPO.message?.toString()}
                inputProps={{ style: { padding: 10 } }}
              />
            </div>
            <div className="flex flex-col gap-4 text-titleColor h-full">
              <label>Form Payment </label>
              <TextField
                {...register("formPayment", {
                  required: "Form payment is required",
                })}
                variant="outlined"
                type="number"
                error={Boolean(!!errors.CPO)}
                helperText={!!errors.CPO && errors.CPO.message?.toString()}
                inputProps={{ style: { padding: 10 } }}
              />
            </div>
            <div className="flex flex-col gap-3 xl:col-span-1 md:col-span-2 sm:col-span-2">
              <span className="text-titleColor text-sm font-bold">
                Form File
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
                    {typeof watch("formFile") === "string"
                      ? watch("formFile").slice(0, 40)
                      : watch("formFile")?.[0]?.name
                      ? watch("formFile")?.[0]?.name
                      : "Upload"}
                  </span>
                </span>
                <input
                  id="formFile"
                  {...register(
                    "formFile"
                    // {
                    //   required: "formFile is required",
                    //   validate: {
                    //     fileSize: (value: any) => {
                    //       if (value && value[0]) {
                    //         return (
                    //           value[0].size < 1048576 ||
                    //           "File size must be less than 1MB"
                    //         );
                    //       }
                    //       return true;
                    //     },
                    //   },
                    // }
                  )}
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
              <div className="flex flex-col gap-4 text-titleColor h-full">
                <label>Description</label>
                <TextField
                  {...register("description", {
                    required: "please add some description",
                  })}
                  variant="outlined"
                  multiline
                  rows={6}
                  error={Boolean(!!errors.description)}
                  helperText={
                    !!errors.description &&
                    errors.description.message?.toString()
                  }
                  inputProps={{ style: { padding: 0 } }}
                />
              </div>
              <div className="flex flex-row items-center gap-1">
                <Checkbox
                  {...register("isPurchasing")}
                  checked={Boolean(watch("isPurchasing"))}
                />
                <span>Purchasing</span>
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
        </form>
      </div>
    </div>
  );
};

export default AddNewAuction;
