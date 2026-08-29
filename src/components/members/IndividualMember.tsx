import { COUNTRIES, Dawuro_Branches, NATIONALITIES } from "@/constants/datas";
import { international_phone_regex } from "@/constants/regex";
import { showToastAction } from "@/redux/actions";
import { getMinimumContribution } from "@/util/helper";
import { Button, MenuItem, TextField } from "@mui/material";
import {
  ContributionSystem,
  EducationLevel,
  MembershipLevel,
  MembershipType,
  PaymentMeans,
} from "@prisma/client";
import Image from "next/image";
import {
  FieldErrors,
  FieldValues,
  UseFormRegister,
  UseFormSetValue,
  UseFormWatch,
} from "react-hook-form";
import { useDispatch } from "react-redux";
import { PhoneNumberInput } from "../shared/PhoneNumberInput";

const IndividualMember = ({
  register,
  watch,
  errors,
  setValue,
}: {
  register: UseFormRegister<FieldValues>;
  watch: UseFormWatch<FieldValues>;
  errors: FieldErrors<FieldValues>;
  setValue: UseFormSetValue<FieldValues>;
}) => {
  const dispatch = useDispatch();
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
            error={Boolean(!!errors.firstName)}
            helperText={
              !!errors.firstName && errors.firstName.message?.toString()
            }
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
          <PhoneNumberInput
            size="small"
            {...register("phone", {
              required: "Phone Number is required",
              pattern: {
                message: "Phone is not valid",
                value: international_phone_regex,
              },
            })}
            variant="outlined"
            className="border-2 rounded-[16px] py-2"
            inputProps={{ style: { padding: 10 } }}
            value={watch("phone")}
            onChange={(value) => setValue("phone", value.replace(/\s+/g, ""))}
            type="text"
            placeholder=""
            error={Boolean(!!errors.phone)}
            helperText={!!errors.phone && errors.phone.message?.toString()}
          />
        </div>
        <div className="flex flex-col gap-1">
          <span className="text-titleColor text-sm font-bold">Email</span>
          <TextField
            size="small"
            {...register("email")}
            type="text"
            placeholder=""
            className="border-2 rounded-[16px] py-2"
            inputProps={{ style: { padding: 10 } }}
            error={Boolean(!!errors.email)}
            helperText={!!errors.email && errors.email.message?.toString()}
          />
        </div>
        <div className="flex flex-col gap-2">
          <span className="text-titleColor text-sm font-bold">Gender</span>
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
              helperText={!!errors.gender && errors.gender.message?.toString()}
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
            type="date"
            placeholder=""
            className="border-2 rounded-[16px] py-2"
            inputProps={{ style: { padding: 10 } }}
            error={Boolean(!!errors.dateOfBirth)}
            helperText={
              !!errors.dateOfBirth && errors.dateOfBirth.message?.toString()
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
            helperText={!!errors.region && errors.region.message?.toString()}
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
            error={Boolean(!!errors.zone)}
            helperText={!!errors.zone && errors.zone.message?.toString()}
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
            helperText={!!errors.city && errors.city.message?.toString()}
          />
        </div>
        <div className="flex flex-col gap-1">
          <span className="text-titleColor text-sm font-bold">Kebele|Ward</span>
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
            helperText={!!errors.kebele && errors.kebele.message?.toString()}
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
            error={Boolean(!!errors.workPlace)}
            helperText={
              !!errors.workPlace && errors.workPlace.message?.toString()
            }
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
            error={Boolean(!!errors.idNumber)}
            helperText={
              !!errors.idNumber && errors.idNumber.message?.toString()
            }
          />
        </div>
        <div className="flex flex-col gap-1">
          <span className="text-titleColor text-sm font-bold">Country</span>
          <TextField
            size="small"
            {...register("country", {
              required: "Country is required",
            })}
            type="text"
            placeholder=""
            className="border-2 rounded-[16px] py-2"
            inputProps={{ style: { padding: 10 } }}
            error={Boolean(!!errors.country)}
            helperText={!!errors.country && errors.country.message?.toString()}
            select
          >
            {COUNTRIES.map((country, index) => (
              <MenuItem key={index} value={country.name}>
                {country.name}
              </MenuItem>
            ))}
          </TextField>
        </div>
        <div className="flex flex-col gap-1">
          <span className="text-titleColor text-sm font-bold">Nationality</span>
          <TextField
            size="small"
            {...register("nationality", {
              required: "Nationality is required",
            })}
            type="text"
            placeholder=""
            className="border-2 rounded-[16px] py-2"
            inputProps={{ style: { padding: 10 } }}
            error={Boolean(!!errors.nationality)}
            helperText={
              !!errors.nationality && errors.nationality.message?.toString()
            }
            select
          >
            {NATIONALITIES.map((nationality, index) => (
              <MenuItem key={index} value={nationality}>
                {nationality}
              </MenuItem>
            ))}
          </TextField>
        </div>
        <div className="flex flex-col gap-1">
          <span className="text-titleColor text-sm font-bold">DaDA branch</span>
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
            helperText={!!errors.branch && errors.branch.message?.toString()}
            select
          >
            {Dawuro_Branches.map((branch, index) => (
              <MenuItem key={index} value={branch}>
                {branch}
              </MenuItem>
            ))}
          </TextField>
        </div>
        <div className="flex flex-col gap-3 xl:col-span-2 md:col-span-2 sm:col-span-2">
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
                required: "ProfileImage is required",
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
            {!!errors.profileImage && errors.profileImage.message?.toString()}
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
              <MenuItem value={MembershipLevel?.Platinum}>
                {MembershipLevel?.Platinum}
                {" (10,000 ETB/year)"}
              </MenuItem>
              <MenuItem value={MembershipLevel?.Diamond}>
                {MembershipLevel?.Diamond}
                {" (7,000 ETB/year)"}
              </MenuItem>
              <MenuItem value={MembershipLevel?.Gold}>
                {MembershipLevel?.Gold}
                {" (5,000 ETB/year)"}
              </MenuItem>
              <MenuItem value={MembershipLevel?.Silver}>
                {MembershipLevel?.Silver}
                {" (3,000 ETB/year)"}
              </MenuItem>
              <MenuItem value={MembershipLevel?.Bronze}>
                {MembershipLevel?.Bronze}
                {" (1,000 ETB/year)"}
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
        <div className="flex flex-col gap-1">
          <span className="text-titleColor text-sm font-bold">Occupation</span>
          <TextField
            size="small"
            {...register("expertise", {
              required: "Occupation is required",
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
              <MenuItem value={PaymentMeans.Other}>
                {PaymentMeans.Other}
              </MenuItem>
            </TextField>
          </div>
        </div>
      </div>
    </>
  );
};

export default IndividualMember;
