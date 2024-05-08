"use client";

import { Button, MenuItem, Select, Switch, TextField } from "@mui/material";
import PageHeader from "../shared/PageHeader";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { FieldValues, useForm } from "react-hook-form";
import axios from "axios";

const AddNewMember = () => {
  const router = useRouter();
  const [registrationError, setRegistrationError] = useState<string>("");
  const [loading, setLoading] = useState<boolean>(false);
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm();

  const handleRegister = async (values: FieldValues) => {
    const { email, password } = values;
    setLoading(true);
    try {
      const res = await axios.post("/api/members/register", values);

      if (res?.status === 200) {
        router.push("/admin/dashboard/members");
      }
    } catch (err: any) {
      console.error(err);
      setRegistrationError(err?.response?.data?.error);
    }
    setLoading(false);
  };

  return (
    <div className="h-full w-full overflow-y-auto">
      <PageHeader />
      <div className="px-[40px] w-full flex flex-col mt-10">
        <span className="text-titleColor font-bold text-3xl">
          New Member Registration Form
        </span>
        <form
          onSubmit={handleSubmit(handleRegister)}
          className="flex flex-col w-full my-10"
        >
          <div className="flex flex-row items-center justify-between gap-6">
            <span className="font-bold">Personal Information</span>
            <div className="border-b-[1px] flex-1 border-b-titleColor opacity-25" />
          </div>
          <div className="grid xl:lg:grid-cols-4 md:grid-cols-3 sm:grid-cols-2 gap-4 py-12 px-4">
            <div className="flex flex-col gap-1">
              <span className="text-titleColor text-sm font-bold">
                First Name
              </span>
              <TextField
                size="small"
                {...register("firstName", {
                  required: "First Name is required",
                })}
                type="text"
                placeholder=""
                className="border-2 rounded-[16px] py-2"
                inputProps={{ style: { padding: 10 } }}
              />
            </div>
            <div className="flex flex-col gap-1">
              <span className="text-titleColor text-sm font-bold">
                Last Name
              </span>
              <TextField
                size="small"
                {...register("lastName", {
                  required: "Last Name is required",
                })}
                type="text"
                placeholder=""
                className="border-2 rounded-[16px] py-2"
                inputProps={{ style: { padding: 10 } }}
              />
            </div>
            <div className="flex flex-col gap-1">
              <span className="text-titleColor text-sm font-bold">
                Phone Number
              </span>
              <TextField
                size="small"
                {...register("phoneNumber", {
                  required: "Phone Number is required",
                })}
                type="text"
                placeholder=""
                className="border-2 rounded-[16px] py-2"
                inputProps={{ style: { padding: 10 } }}
              />
            </div>
            <div className="flex flex-col gap-1">
              <span className="text-titleColor text-sm font-bold">
                Date of birth
              </span>
              <TextField
                size="small"
                {...register("dateOfBirth", {
                  required: "Date of birth is required",
                })}
                type="text"
                placeholder=""
                className="border-2 rounded-[16px] py-2"
                inputProps={{ style: { padding: 10 } }}
              />
            </div>
            <div className="flex flex-col gap-1">
              <span className="text-titleColor text-sm font-bold">Region</span>
              <TextField
                size="small"
                {...register("region", {
                  required: "Region is required",
                })}
                type="text"
                placeholder=""
                className="border-2 rounded-[16px] py-2"
                inputProps={{ style: { padding: 10 } }}
              />
            </div>
            <div className="flex flex-col gap-1">
              <span className="text-titleColor text-sm font-bold">Zone</span>
              <TextField
                size="small"
                {...register("zone", {
                  required: "Zone is required",
                })}
                type="text"
                placeholder=""
                className="border-2 rounded-[16px] py-2"
                inputProps={{ style: { padding: 10 } }}
              />
            </div>
            <div className="flex flex-col gap-1">
              <span className="text-titleColor text-sm font-bold">City</span>
              <TextField
                size="small"
                {...register("city", {
                  required: "City is required",
                })}
                type="text"
                placeholder=""
                className="border-2 rounded-[16px] py-2"
                inputProps={{ style: { padding: 10 } }}
              />
            </div>
            <div className="flex flex-col gap-1">
              <span className="text-titleColor text-sm font-bold">Kebele</span>
              <TextField
                size="small"
                {...register("kebele", {
                  required: "Kebele is required",
                })}
                type="text"
                placeholder=""
                className="border-2 rounded-[16px] py-2"
                inputProps={{ style: { padding: 10 } }}
              />
            </div>
          </div>
          <div className="flex flex-row items-center justify-between gap-6">
            <span className="font-bold">Membership | Professional Info</span>
            <div className="border-b-[1px] flex-1 border-b-titleColor opacity-25" />
          </div>
          <div className="grid xl:lg:grid-cols-4 md:grid-cols-3 sm:grid-cols-2 gap-4 py-12 px-4">
            <div className="flex flex-col gap-2">
              <span className="text-titleColor text-sm font-bold">
                Membership Level
              </span>
              <div className="min-w-[130px]">
                <Select
                  className="w-full p-[1px]"
                  defaultValue={""}
                  size="small"
                >
                  <MenuItem value="membershipLevel">premium</MenuItem>
                  <MenuItem value="last 7 day">last 7 days</MenuItem>
                  <MenuItem value="last month">last month</MenuItem>
                </Select>
              </div>
            </div>
            <div className="flex flex-col gap-2">
              <span className="text-titleColor text-sm font-bold">
                Contribution system
              </span>
              <div className="min-w-[130px]">
                <Select
                  className="w-full p-[1px]"
                  defaultValue={""}
                  size="small"
                >
                  <MenuItem value="membershipLevel">premium</MenuItem>
                  <MenuItem value="last 7 day">last 7 days</MenuItem>
                  <MenuItem value="last month">last month</MenuItem>
                </Select>
              </div>
            </div>
            <div className="flex flex-col gap-2">
              <span className="text-titleColor text-sm font-bold">
                Education Level
              </span>
              <TextField
                size="small"
                {...register("educationLevel", {
                  required: "Education Level is required",
                })}
                type="text"
                placeholder=""
                className="border-2 rounded-[16px] "
                inputProps={{ style: { padding: 10 } }}
              />
            </div>
            <div className="flex flex-col gap-2">
              <span className="text-titleColor text-sm font-bold">
                Contribution Amount
              </span>
              <div className="min-w-[130px]">
                <TextField
                  select
                  className="w-full p-[1px]"
                  defaultValue={""}
                  size="small"
                  helperText={
                    "As per your Premium Level membership, the contribution amount is >=100"
                  }
                >
                  <MenuItem value="membershipLevel">premium</MenuItem>
                  <MenuItem value="last 7 day">last 7 days</MenuItem>
                  <MenuItem value="last month">last month</MenuItem>
                </TextField>
              </div>
            </div>
            <div className="flex flex-col gap-1">
              <span className="text-titleColor text-sm font-bold">
                Expertise
              </span>
              <TextField
                size="small"
                {...register("expertise", {
                  required: "Expertise is required",
                })}
                type="text"
                placeholder=""
                className="border-2 rounded-[16px] py-2"
                inputProps={{ style: { padding: 10 } }}
              />
            </div>
            <div className="flex flex-col gap-1">
              <span className="text-titleColor text-sm font-bold">
                Position at work
              </span>
              <TextField
                size="small"
                {...register("positionAtWork", {
                  required: "Position at work is required",
                })}
                type="text"
                placeholder=""
                className="border-2 rounded-[16px] py-2"
                inputProps={{ style: { padding: 10 } }}
              />
            </div>
          </div>
          <div className="flex flex-row items-center justify-between gap-6 my-6">
            <span className="font-bold flex flex-row items-center gap-6">
              <span>Payment</span>
              <Switch defaultChecked={false} {...register("paymentStatus")} />
            </span>
            <div className="border-b-[1px] flex-1 border-b-titleColor opacity-25" />
          </div>
          <div className="mt-6">
            <Button
              variant="contained"
              className="bg-primaryColor text-white px-10 py-4 font-bold min-w-64"
            >
              Register
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AddNewMember;
