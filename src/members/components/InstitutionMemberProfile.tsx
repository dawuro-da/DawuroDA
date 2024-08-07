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
import { MembershipType } from "@prisma/client";
import { MenuItem, Switch, TextField } from "@mui/material";
import {
  ContributionSystem,
  Member,
  MembershipLevel,
  PaymentMeans,
} from "@prisma/client";
import { FieldValues } from "react-hook-form";
import { getMinimumContribution } from "@/util/helper";
import { getMemberFormData } from "@/util/getMemberFormData";
import Image from "next/image";

const InstitutionMemberProfile = ({ member }: { member: Member }) => {
  const router = useRouter();
  const dispatch = useDispatch();
  const [loading, setLoading] = useState<boolean>(false);

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

  return (
    <div className="h-full w-full overflow-y-auto">
      <div className="w-full flex flex-col mt-10">
        <form onSubmit={handleSubmit(handleEditMember)} className="mb-12">
          <div className="flex flex-col w-full my-10">
            <>
              <div className="flex flex-row items-center justify-between gap-6">
                <span className="font-bold">Personal Information</span>
                <div className="border-b-[1px] flex-1 border-b-titleColor opacity-25" />
              </div>
              <div className="grid xl:lg:grid-cols-4 md:grid-cols-3 sm:grid-cols-2 gap-4 py-12 px-4">
                <div className="flex flex-col gap-1 col-span-2">
                  <span className="text-titleColor text-sm font-bold">
                    Institution Name
                  </span>
                  <TextField
                    size="small"
                    {...register("institutionName", {
                      required: "Institution Name is required",
                    })}
                    type="text"
                    placeholder=""
                    className="border-2 rounded-[16px] py-2"
                    inputProps={{ style: { padding: 10 } }}
                    error={Boolean(!!errors.institutionName)}
                    helperText={
                      !!errors.institutionName &&
                      errors.institutionName.message?.toString()
                    }
                  />
                </div>
                <div className="flex flex-col gap-1">
                  <span className="text-titleColor text-sm font-bold">
                    Head | Representative
                  </span>
                  <TextField
                    size="small"
                    {...register("headOrRepresentative", {
                      required: "Head/Representative is required",
                    })}
                    type="text"
                    placeholder=""
                    className="border-2 rounded-[16px] py-2"
                    inputProps={{ style: { padding: 10 } }}
                    error={Boolean(!!errors.headOrRepresentative)}
                    helperText={
                      !!errors.headOrRepresentative &&
                      errors.headOrRepresentative.message?.toString()
                    }
                  />
                </div>
                <div className="flex flex-col gap-1">
                  <span className="text-titleColor text-sm font-bold">
                    Field of Work
                  </span>
                  <TextField
                    size="small"
                    {...register("fieldOfWork", {
                      required: "Field of Work is required",
                    })}
                    type="text"
                    placeholder=""
                    className="border-2 rounded-[16px] py-2"
                    inputProps={{ style: { padding: 10 } }}
                    error={Boolean(!!errors.fieldOfWork)}
                    helperText={
                      !!errors.fieldOfWork &&
                      errors.fieldOfWork.message?.toString()
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
                <div className="flex flex-col gap-1 col-span-2">
                  <span className="text-titleColor text-sm font-bold">
                    Partnership ideas
                  </span>
                  <TextField
                    size="small"
                    {...register("partnershipIdea", {
                      required: "Partnership ideas is required",
                    })}
                    type="text"
                    placeholder=""
                    className="border-2 rounded-[16px] py-2"
                    inputProps={{ style: { padding: 10 } }}
                    error={Boolean(!!errors.partnershipIdea)}
                    helperText={
                      !!errors.partnershipIdea &&
                      errors.partnershipIdea.message?.toString()
                    }
                  />
                </div>
                <div className="flex flex-col gap-1">
                  <span className="text-titleColor text-sm font-bold">
                    Region|State|Province
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
                    City|District
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
                    Kebele|Ward
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
                      defaultValue={member?.membershipLevel}
                      {...register("membershipLevel", {
                        required: "Membership Level is required",
                      })}
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
                        {"(>100K ETB)"}
                      </MenuItem>
                      <MenuItem value={MembershipLevel?.Diamond}>
                        {MembershipLevel?.Diamond}
                        {"(80K-100K ETB)"}
                      </MenuItem>
                      <MenuItem value={MembershipLevel?.Gold}>
                        {MembershipLevel?.Gold}
                        {"(50K-80K ETB)"}
                      </MenuItem>
                      <MenuItem value={MembershipLevel?.Siliver}>
                        {MembershipLevel?.Siliver}
                        {"(30K-50K ETB)"}
                      </MenuItem>
                      <MenuItem value={MembershipLevel?.Bronze}>
                        {MembershipLevel?.Bronze}
                        {"(10K-30K ETB)"}
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
                              membershipType: MembershipType.Company,
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
                      select
                      className="w-full p-[1px]"
                      defaultValue={member?.paymentMeans}
                      size="small"
                      {...register("paymentMeans", {
                        required: "Payment Means is required",
                      })}
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
              <div className="flex flex-row items-center justify-between gap-6 my-4">
                <span className="font-bold flex flex-row items-center gap-6">
                  <span>Payment</span>
                  <Switch
                    checked={watch("hasPaid") === true}
                    {...register("hasPaid")}
                  />
                </span>
                <div className="border-b-[1px] flex-1 border-b-titleColor opacity-25" />
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

export default InstitutionMemberProfile;
