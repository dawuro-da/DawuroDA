import { Button, MenuItem, TextField } from "@mui/material";
import {
  ContributionSystem,
  MembershipLevel,
  PaymentMeans,
} from "@prisma/client";
import Image from "next/image";
import {
  FieldErrors,
  FieldValues,
  UseFormRegister,
  UseFormWatch,
} from "react-hook-form";

interface InstitutionProfessionFormProps {
  register: UseFormRegister<FieldValues>;
  loginError: string;
  errors: FieldErrors<FieldValues>;
  watch: UseFormWatch<FieldValues>;
}

const InstitutionProfessionForm = ({
  register,
  loginError,
  errors,
  watch,
}: InstitutionProfessionFormProps) => {
  return (
    <div className="grid xl:lg:grid-cols-3 md:grid-cols-3 sm:grid-cols-2 gap-4 py-12 px-4">
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
            className="w-full p-[1px]"
            defaultValue={""}
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
            defaultValue={""}
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
          className="border-2 rounded-[16px] py-1"
          inputProps={{ style: { padding: 10 } }}
          error={Boolean(!!errors.positionAtWork)}
          helperText={
            !!errors.positionAtWork && errors.positionAtWork.message?.toString()
          }
        />
      </div>

      <div className="flex flex-col gap-3">
        <span className="text-titleColor text-sm font-bold">Payment Means</span>
        <div className="min-w-[130px]">
          <TextField
            select
            className="w-full p-[1px]"
            defaultValue={""}
            size="small"
            {...register("paymentMeans", {
              required: "Payment Means is required",
            })}
            error={Boolean(!!errors.paymentMeans)}
            helperText={
              !!errors.paymentMeans && errors.paymentMeans.message?.toString()
            }
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
            <MenuItem value={PaymentMeans.Other}>{PaymentMeans.Other}</MenuItem>
          </TextField>
        </div>
      </div>
    </div>
  );
};

export default InstitutionProfessionForm;
