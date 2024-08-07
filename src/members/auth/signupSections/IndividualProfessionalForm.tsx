import { getMinimumContribution } from "@/util/helper";
import { MenuItem, TextField } from "@mui/material";
import {
  ContributionSystem,
  EducationLevel,
  MembershipLevel,
  MembershipType,
  PaymentMeans,
} from "@prisma/client";
import {
  FieldErrors,
  FieldValues,
  UseFormRegister,
  UseFormWatch,
} from "react-hook-form";

interface IndividualProfessionalFormProps {
  register: UseFormRegister<FieldValues>;
  loginError: string;
  errors: FieldErrors<FieldValues>;
  watch: UseFormWatch<FieldValues>;
}

const IndividualProfessionalForm = ({
  register,
  loginError,
  errors,
  watch,
}: IndividualProfessionalFormProps) => {
  return (
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
            className="w-full p-[1px]"
            defaultValue={watch("membershipLevel")}
            size="small"
            error={Boolean(!!errors.membershipLevel)}
            helperText={
              !!errors.membershipLevel &&
              errors.membershipLevel.message?.toString()
            }
          >
            <MenuItem value={MembershipLevel?.Platinium}>
              {MembershipLevel?.Platinium}
              {" (>100 ETB)"}
            </MenuItem>
            <MenuItem value={MembershipLevel?.Diamond}>
              {MembershipLevel?.Diamond}
              {" (80-100 ETB)"}
            </MenuItem>
            <MenuItem value={MembershipLevel?.Gold}>
              {MembershipLevel?.Gold}
              {" (50-80 ETB)"}
            </MenuItem>
            <MenuItem value={MembershipLevel?.Siliver}>
              {MembershipLevel?.Siliver}
              {" (30-50 ETB)"}
            </MenuItem>
            <MenuItem value={MembershipLevel?.Bronze}>
              {MembershipLevel?.Bronze}
              {" (10-30 ETB)"}
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
          error={Boolean(!!errors.contributionAmount)}
          helperText={
            !!errors.contributionAmount &&
            errors.contributionAmount.message?.toString()
          }
        />
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
            !!errors.educationLevel && errors.educationLevel.message?.toString()
          }
          select
        >
          <MenuItem value={EducationLevel.PHD}>{EducationLevel.PHD}</MenuItem>
          <MenuItem value={EducationLevel.Masters}>
            {EducationLevel.Masters}
          </MenuItem>
          <MenuItem value={EducationLevel.Degree}>
            {EducationLevel.Degree}
          </MenuItem>
          <MenuItem value={EducationLevel.Associate_Degree}>
            {EducationLevel.Associate_Degree}
          </MenuItem>
          <MenuItem value={EducationLevel.Diploma}>
            {EducationLevel.Diploma}
          </MenuItem>
          <MenuItem value={EducationLevel.High_School}>
            {EducationLevel.High_School}
          </MenuItem>
          <MenuItem value={EducationLevel.Middle_Elementary_School}>
            {EducationLevel.Middle_Elementary_School}
          </MenuItem>
          <MenuItem value={EducationLevel.Other}>
            {EducationLevel.Other}
          </MenuItem>
        </TextField>
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
            defaultValue={watch("paymentMeans")}
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

export default IndividualProfessionalForm;
