"use client";

import {
  Avatar,
  Button,
  CircularProgress,
  FormControlLabel,
  Radio,
  RadioGroup,
} from "@mui/material";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import axios from "axios";
import { useDispatch } from "react-redux";
import { showToastAction } from "@/redux/actions";
import { Member, MembershipType } from "@prisma/client";
import { MenuItem, Switch, TextField } from "@mui/material";
import {
  ContributionSystem,
  MembershipLevel,
  PaymentMeans,
} from "@prisma/client";
import Image from "next/image";
import { FieldValues } from "react-hook-form";
import { getMinimumContribution } from "@/util/helper";
import { getMemberFormData } from "@/util/getMemberFormData";

const IndividualMemberProfile = ({ member }: { member: Member }) => {
  const router = useRouter();
  const dispatch = useDispatch();
  const [loading, setLoading] = useState<boolean>(false);
  const [previewUrl, setPreviewUrl] = useState("");

  const {
    register,
    handleSubmit,
    watch,
    formState: { errors },
    setValue,
  } = useForm({
    defaultValues: member,
  });

  const handleEditMember = async (values: FieldValues) => {
    setLoading(true);
    const formData = getMemberFormData(values);
    try {
      const res = await axios.post(`/api/member/edit/${member?.id}`, formData);

      if (res?.status === 200) {
        router.push("/member/dashboard");
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

  const handleFileChange = () => {
    if (typeof watch("profileImage") === "string") {
      setPreviewUrl(watch("profileImage") as string);
    } else {
      const file = watch("profileImage")?.[0] as unknown as File;
      if (file) {
        const reader = new FileReader();
        reader.onloadend = () => {
          if (reader.result) setPreviewUrl(reader.result as string);
        };
        reader.readAsDataURL(file);
      }
    }
  };

  useEffect(() => {
    handleFileChange();
  }, [watch("profileImage")]);

  return (
    <div className="h-full w-full overflow-y-auto">
      <div className=" w-full flex flex-col mt-10">
        <form onSubmit={handleSubmit(handleEditMember)} className="mb-12">
          <div className="flex flex-col w-full my-10">
            <div className="w-full flex flex-col items-center justify-center mb-12">
              <div className="relative w-fit h-fit">
                <Avatar
                  src={previewUrl}
                  style={{
                    width: 100,
                    height: 100,
                  }}
                />
                <div className="h-[30px] w-[30px] absolute bottom-0 right-0 cursor-pointer z-10">
                  <Image
                    className=" cursor-pointer"
                    src="/icons/uploadCamera.svg"
                    alt=""
                    height={30}
                    width={30}
                  />
                  <input
                    id="profileImage"
                    {...register("profileImage", {
                      required: "profileImage is required",
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
                                  message: `Image size must be less than 1MB`,
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
                </div>
              </div>
              <span className="text-titleColor mt-4 font-bold text-xl">{`${member.firstName} ${member.lastName}`}</span>
              <span className="text-titleColor">{member.phone}</span>
            </div>
            <>
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
                    error={Boolean(!!errors.firstName)}
                    helperText={
                      !!errors.firstName && errors.firstName.message?.toString()
                    }
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
                    error={Boolean(!!errors.lastName)}
                    helperText={
                      !!errors.lastName && errors.lastName.message?.toString()
                    }
                  />
                </div>
                <div className="flex flex-col gap-1">
                  <span className="text-titleColor text-sm font-bold">
                    Phone Number
                  </span>
                  <TextField
                    size="small"
                    {...register("phone", {
                      required: "Phone Number is required",
                    })}
                    type="text"
                    placeholder=""
                    className="border-2 rounded-[16px] py-2"
                    inputProps={{ style: { padding: 10 } }}
                    error={Boolean(!!errors.phone)}
                    helperText={
                      !!errors.phone && errors.phone.message?.toString()
                    }
                  />
                </div>
                <div className="flex flex-col gap-1">
                  <span className="text-titleColor text-sm font-bold">
                    Email
                  </span>
                  <TextField
                    size="small"
                    {...register("email")}
                    type="text"
                    placeholder=""
                    className="border-2 rounded-[16px] py-2"
                    inputProps={{ style: { padding: 10 } }}
                    error={Boolean(!!errors.email)}
                    helperText={
                      !!errors.email && errors.email.message?.toString()
                    }
                  />
                </div>
                <div className="flex flex-col gap-2">
                  <span className="text-titleColor text-sm font-bold">
                    Gender
                  </span>
                  <div className="min-w-[130px]">
                    <TextField
                      select
                      className="w-full p-[1px]"
                      defaultValue={watch("gender")}
                      size="small"
                      {...register("gender", {
                        required: "Gender is required",
                      })}
                      error={Boolean(!!errors.gender)}
                      helperText={
                        !!errors.gender && errors.gender.message?.toString()
                      }
                    >
                      <MenuItem disabled value={"Gender"}>
                        {"Gender"}
                      </MenuItem>
                      <MenuItem value={"Male"}>{"Male"}</MenuItem>
                      <MenuItem value={"Female"}>{"Female"}</MenuItem>
                    </TextField>
                  </div>
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
                    error={Boolean(!!errors.dateOfBirth)}
                    helperText={
                      !!errors.dateOfBirth &&
                      errors.dateOfBirth.message?.toString()
                    }
                  />
                </div>
                <div className="flex flex-col gap-1">
                  <span className="text-titleColor text-sm font-bold">
                    Region
                  </span>
                  <TextField
                    size="small"
                    {...register("region", {
                      required: "Region is required",
                    })}
                    type="text"
                    placeholder=""
                    className="border-2 rounded-[16px] py-2"
                    inputProps={{ style: { padding: 10 } }}
                    error={Boolean(!!errors.region)}
                    helperText={
                      !!errors.region && errors.region.message?.toString()
                    }
                  />
                </div>
                <div className="flex flex-col gap-1">
                  <span className="text-titleColor text-sm font-bold">
                    Zone
                  </span>
                  <TextField
                    size="small"
                    {...register("zone", {
                      required: "Zone is required",
                    })}
                    type="text"
                    placeholder=""
                    className="border-2 rounded-[16px] py-2"
                    inputProps={{ style: { padding: 10 } }}
                    error={Boolean(!!errors.zone)}
                    helperText={
                      !!errors.zone && errors.zone.message?.toString()
                    }
                  />
                </div>
                <div className="flex flex-col gap-1">
                  <span className="text-titleColor text-sm font-bold">
                    City
                  </span>
                  <TextField
                    size="small"
                    {...register("city", {
                      required: "City is required",
                    })}
                    type="text"
                    placeholder=""
                    className="border-2 rounded-[16px] py-2"
                    inputProps={{ style: { padding: 10 } }}
                    error={Boolean(!!errors.city)}
                    helperText={
                      !!errors.city && errors.city.message?.toString()
                    }
                  />
                </div>
                <div className="flex flex-col gap-1">
                  <span className="text-titleColor text-sm font-bold">
                    Kebele
                  </span>
                  <TextField
                    size="small"
                    {...register("kebele", {
                      required: "Kebele is required",
                    })}
                    type="text"
                    placeholder=""
                    className="border-2 rounded-[16px] py-2"
                    inputProps={{ style: { padding: 10 } }}
                    error={Boolean(!!errors.kebele)}
                    helperText={
                      !!errors.kebele && errors.kebele.message?.toString()
                    }
                  />
                </div>
                <div className="flex flex-col gap-1">
                  <span className="text-titleColor text-sm font-bold">
                    Work place
                  </span>
                  <TextField
                    size="small"
                    {...register("workPlace", {
                      required: "Work Place is required",
                    })}
                    type="text"
                    placeholder=""
                    className="border-2 rounded-[16px] py-2"
                    inputProps={{ style: { padding: 10 } }}
                    error={Boolean(!!errors.workPlace)}
                    helperText={
                      !!errors.workPlace && errors.workPlace.message?.toString()
                    }
                  />
                </div>
                <div className="flex flex-col gap-1">
                  <span className="text-titleColor text-sm font-bold">
                    ID Number
                  </span>
                  <TextField
                    size="small"
                    {...register("idNumber", {
                      required: "ID Number is required",
                    })}
                    type="text"
                    placeholder=""
                    className="border-2 rounded-[16px] py-2"
                    inputProps={{ style: { padding: 10 } }}
                    error={Boolean(!!errors.idNumber)}
                    helperText={
                      !!errors.idNumber && errors.idNumber.message?.toString()
                    }
                  />
                </div>
                <div className="flex flex-col gap-1">
                  <span className="text-titleColor text-sm font-bold">
                    Branch
                  </span>
                  <TextField
                    size="small"
                    {...register("branch", {
                      required: "Branch is required",
                    })}
                    type="text"
                    placeholder=""
                    className="border-2 rounded-[16px] py-2"
                    inputProps={{ style: { padding: 10 } }}
                    error={Boolean(!!errors.branch)}
                    helperText={
                      !!errors.branch && errors.branch.message?.toString()
                    }
                  />
                </div>
              </div>
              <div className="flex flex-row items-center justify-between gap-6">
                <span className="font-bold">
                  Membership | Professional Info
                </span>
                <div className="border-b-[1px] flex-1 border-b-titleColor opacity-25" />
              </div>
              <div className="grid xl:lg:grid-cols-4 md:grid-cols-3 sm:grid-cols-2 gap-4 py-12 px-4">
                <div className="flex flex-col gap-2">
                  <span className="text-titleColor text-sm font-bold">
                    Membership Level
                  </span>
                  <div className="min-w-[130px]">
                    <TextField
                      select
                      {...register("membershipLevel", {
                        required: "Membership Level is required",
                      })}
                      defaultValue={watch("membershipLevel")}
                      className="w-full p-[1px]"
                      size="small"
                      error={Boolean(!!errors.membershipLevel)}
                      helperText={
                        !!errors.membershipLevel &&
                        errors.membershipLevel.message?.toString()
                      }
                    >
                      <MenuItem value={MembershipLevel?.Platinium}>
                        {MembershipLevel?.Platinium}
                      </MenuItem>
                      <MenuItem value={MembershipLevel?.Diamond}>
                        {MembershipLevel?.Diamond}
                      </MenuItem>
                      <MenuItem value={MembershipLevel?.Gold}>
                        {MembershipLevel?.Gold}
                      </MenuItem>
                      <MenuItem value={MembershipLevel?.Siliver}>
                        {MembershipLevel?.Siliver}
                      </MenuItem>
                      <MenuItem value={MembershipLevel?.Bronze}>
                        {MembershipLevel?.Bronze}
                      </MenuItem>
                    </TextField>
                  </div>
                </div>
                <div className="flex flex-col gap-2">
                  <span className="text-titleColor text-sm font-bold">
                    Contribution system
                  </span>
                  <div className="min-w-[130px]">
                    <TextField
                      select
                      className="w-full p-[1px]"
                      defaultValue={watch("contributionSystem")}
                      size="small"
                      {...register("contributionSystem", {
                        required: "Contribution System is required",
                      })}
                      error={Boolean(!!errors.contributionSystem)}
                      helperText={
                        !!errors.contributionSystem &&
                        errors.contributionSystem.message?.toString()
                      }
                    >
                      <MenuItem value={ContributionSystem?.Yearly}>
                        {ContributionSystem?.Yearly}
                      </MenuItem>
                      <MenuItem value={ContributionSystem?.Quarterly}>
                        {ContributionSystem?.Quarterly}
                      </MenuItem>
                      <MenuItem value={ContributionSystem?.Monthly}>
                        {ContributionSystem?.Monthly}
                      </MenuItem>
                    </TextField>
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
                    error={Boolean(!!errors.educationLevel)}
                    helperText={
                      !!errors.educationLevel &&
                      errors.educationLevel.message?.toString()
                    }
                  />
                </div>
                <div className="flex flex-col gap-2">
                  <span className="text-titleColor text-sm font-bold">
                    Contribution Amount
                  </span>
                  <TextField
                    size="small"
                    {...register("contributionAmount", {
                      required: "Contribution Amount is required",
                      validate: {
                        minAmount: (value: any) => {
                          if (
                            value &&
                            watch("membershipLevel") &&
                            watch("contributionSystem")
                          ) {
                            const minAmount = getMinimumContribution({
                              membershipLevel: watch("membershipLevel"),
                              membershipType: MembershipType.Individual,
                              contributionSystem: watch("contributionSystem"),
                            });
                            if (parseFloat(value) >= minAmount) {
                              return true; // Value is valid
                            } else {
                              return `As per your ${watch(
                                "membershipLevel"
                              )} Level membership, the contribution amount should be >= ${minAmount}`;
                            }
                          }
                          return false;
                        },
                      },
                    })}
                    type="number"
                    placeholder=""
                    className="border-2 rounded-[16px] "
                    inputProps={{ style: { padding: 10 } }}
                    // helperText={
                    //   "As per your Platinium Level membership, the contribution amount is >=100"
                    // }
                    error={Boolean(!!errors.contributionAmount)}
                    helperText={
                      !!errors.contributionAmount &&
                      errors.contributionAmount.message?.toString()
                    }
                  />
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
                    error={Boolean(!!errors.expertise)}
                    helperText={
                      !!errors.expertise && errors.expertise.message?.toString()
                    }
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
                    error={Boolean(!!errors.positionAtWork)}
                    helperText={
                      !!errors.positionAtWork &&
                      errors.positionAtWork.message?.toString()
                    }
                  />
                </div>
                <div className="flex flex-col gap-3">
                  <span className="text-titleColor text-sm font-bold">
                    Payment Means
                  </span>
                  <div className="min-w-[130px]">
                    <TextField
                      className="w-full p-[1px]"
                      defaultValue={watch("paymentMeans")}
                      size="small"
                      {...register("paymentMeans", {
                        required: "Payment Means is required",
                      })}
                      select
                      error={Boolean(!!errors.paymentMeans)}
                      helperText={
                        !!errors.paymentMeans &&
                        errors.paymentMeans.message?.toString()
                      }
                    >
                      <MenuItem value={PaymentMeans.Office}>
                        {PaymentMeans.Office}
                      </MenuItem>
                      <MenuItem value={PaymentMeans.Edir}>
                        {PaymentMeans.Edir}
                      </MenuItem>
                      <MenuItem value={PaymentMeans.Bank}>
                        {PaymentMeans.Bank}
                      </MenuItem>
                      <MenuItem value={PaymentMeans.Kebele}>
                        {PaymentMeans.Kebele}
                      </MenuItem>
                      <MenuItem value={PaymentMeans.Personal}>
                        {PaymentMeans.Personal}
                      </MenuItem>
                      <MenuItem value={PaymentMeans.Other}>
                        {PaymentMeans.Other}
                      </MenuItem>
                    </TextField>
                  </div>
                </div>
              </div>
            </>
          </div>
          <div className="flex flex-col gap-2 w-full items-center justify-center ">
            <Button
              type="submit"
              variant="contained"
              className="bg-primaryColor text-white px-10 py-4 font-bold w-[250px] h-[60px]"
            >
              {loading ? <CircularProgress className="text-white" /> : "Save"}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default IndividualMemberProfile;
