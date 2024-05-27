import { MenuItem, Select, Switch, TextField } from "@mui/material";
import {
  ContributionSystem,
  MembershipLevel,
  PaymentMeans,
} from "@prisma/client";
import { useEffect } from "react";
const InstitutionMember = ({
  register,
  watch,
}: {
  register: any;
  watch: any;
}) => {
  return (
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
              defaultValue={watch("membershipLevel")}
              {...register("membershipLevel", {
                required: "Membership Level is required",
              })}
              className="w-full p-[1px]"
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
              value={watch("contributionSystem")}
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
              value={watch("paymentMeans")}
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
  );
};

export default InstitutionMember;
