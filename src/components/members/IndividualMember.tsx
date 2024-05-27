import { Button, MenuItem, Select, Switch, TextField } from "@mui/material";
import {
  ContributionSystem,
  MembershipLevel,
  PaymentMeans,
} from "@prisma/client";
import Image from "next/image";
import { useRef } from "react";
import { FieldValues, UseFormRegister, UseFormWatch } from "react-hook-form";

const IndividualMember = ({
  register,
  watch,
}: {
  register: UseFormRegister<FieldValues>;
  watch: UseFormWatch<FieldValues>;
}) => {
  return (
    <>
      <div className="flex flex-row items-center justify-between gap-6">
        <span className="font-bold">Personal Information</span>
        <div className="border-b-[1px] flex-1 border-b-titleColor opacity-25" />
      </div>
      <div className="grid xl:lg:grid-cols-4 md:grid-cols-3 sm:grid-cols-2 gap-4 py-12 px-4">
        <div className="flex flex-col gap-1">
          <span className="text-titleColor text-sm font-bold">First Name</span>
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
          <span className="text-titleColor text-sm font-bold">Last Name</span>
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
            {...register("phone", {
              required: "Phone Number is required",
            })}
            type="text"
            placeholder=""
            className="border-2 rounded-[16px] py-2"
            inputProps={{ style: { padding: 10 } }}
          />
        </div>
        <div className="flex flex-col gap-1">
          <span className="text-titleColor text-sm font-bold">Email</span>
          <TextField
            size="small"
            {...register("email", {
              required: "Email is required",
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
        <div className="flex flex-col gap-1">
          <span className="text-titleColor text-sm font-bold">Work place</span>
          <TextField
            size="small"
            {...register("workPlace", {
              required: "Work Place is required",
            })}
            type="text"
            placeholder=""
            className="border-2 rounded-[16px] py-2"
            inputProps={{ style: { padding: 10 } }}
          />
        </div>
        <div className="flex flex-col gap-1">
          <span className="text-titleColor text-sm font-bold">ID Number</span>
          <TextField
            size="small"
            {...register("idNumber", {
              required: "ID Number is required",
            })}
            type="text"
            placeholder=""
            className="border-2 rounded-[16px] py-2"
            inputProps={{ style: { padding: 10 } }}
          />
        </div>
        <div className="flex flex-col gap-1">
          <span className="text-titleColor text-sm font-bold">Branch</span>
          <TextField
            size="small"
            {...register("branch", {
              required: "Branch is required",
            })}
            type="text"
            placeholder=""
            className="border-2 rounded-[16px] py-2"
            inputProps={{ style: { padding: 10 } }}
          />
        </div>
        <div className="flex flex-col gap-3 xl:col-span-1 md:col-span-2 sm:col-span-2">
          <span className="text-titleColor text-sm font-bold">
            Profile Image
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
                {watch("profileImage") && watch("profileImage")[0]?.name
                  ? watch("profileImage")[0]?.name
                  : "Upload"}
              </span>
            </span>
            <input
              id="profileImage"
              {...register("profileImage", {
                required: "profileImage is required",
                validate: {
                  fileSize: (value:any) => {
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
          <span className="text-[10px] text-titleColor">
            Image size must be 600*600 File size must be less than 1MB
          </span>
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
              {...register("membershipLevel", {
                required: "Membership Level is required",
              })}
              className="w-full p-[1px]"
              defaultValue={""}
              size="small"
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
              {...register("contributionSystem", {
                required: "Contribution System is required",
              })}
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
          <TextField
            size="small"
            {...register("contributionAmount", {
              required: "Contribution Amount is required",
            })}
            type="number"
            placeholder=""
            className="border-2 rounded-[16px] "
            inputProps={{ style: { padding: 10 } }}
            helperText={
              "As per your Platinium Level membership, the contribution amount is >=100"
            }
          />
        </div>
        <div className="flex flex-col gap-1">
          <span className="text-titleColor text-sm font-bold">Expertise</span>
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
        <div className="flex flex-col gap-3">
          <span className="text-titleColor text-sm font-bold">
            Payment Means
          </span>
          <div className="min-w-[130px]">
            <Select
              className="w-full p-[1px]"
              defaultValue={""}
              size="small"
              {...register("paymentMeans", {
                required: "Payment Means is required",
              })}
            >
              <MenuItem value={PaymentMeans.Office}>
                {PaymentMeans.Office}
              </MenuItem>
              <MenuItem value={PaymentMeans.Edir}>{PaymentMeans.Edir}</MenuItem>
              <MenuItem value={PaymentMeans.Bank}>{PaymentMeans.Bank}</MenuItem>
              <MenuItem value={PaymentMeans.Kebele}>
                {PaymentMeans.Kebele}
              </MenuItem>
              <MenuItem value={PaymentMeans.Personal}>
                {PaymentMeans.Personal}
              </MenuItem>
              <MenuItem value={PaymentMeans.Other}>
                {PaymentMeans.Other}
              </MenuItem>
            </Select>
          </div>
        </div>
      </div>
    </>
  );
};

export default IndividualMember;
