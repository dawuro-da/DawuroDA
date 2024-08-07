import { phone_regex } from "@/constants/regex";
import { Button, MenuItem, TextField } from "@mui/material";
import Image from "next/image";
import {
  FieldErrors,
  FieldValues,
  UseFormRegister,
  UseFormWatch,
} from "react-hook-form";

interface InstitutionFormProps {
  register: UseFormRegister<FieldValues>;
  loginError: string;
  errors: FieldErrors<FieldValues>;
  watch: UseFormWatch<FieldValues>;
}

const InstitutionForm = ({
  register,
  errors,
  watch,
  loginError,
}: InstitutionFormProps) => {
  return (
    <div className="grid xl:lg:grid-cols-3 md:grid-cols-3 sm:grid-cols-2 gap-4 py-12 px-4">
      <div className="flex flex-col gap-1">
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
        <span className="text-titleColor text-sm font-bold">Field of Work</span>
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
            !!errors.fieldOfWork && errors.fieldOfWork.message?.toString()
          }
        />
      </div>
      <div className="flex flex-col gap-1">
        <span className="text-titleColor text-sm font-bold">Phone Number</span>
        <TextField
          size="small"
          {...register("phone", {
            required: "Phone Number is required",
            pattern: {
              message: "Phone is not valid eg: 09...",
              value: phone_regex,
            },
          })}
          type="text"
          placeholder=""
          disabled={true}
          className="border-2 rounded-[16px] py-2"
          inputProps={{ style: { padding: 10 } }}
          error={Boolean(!!errors.phone)}
          helperText={!!errors.phone && errors.phone.message?.toString()}
        />
      </div>
      <div className="flex flex-col gap-1">
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
        <span className="text-titleColor text-sm font-bold">City|District</span>
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
    </div>
  );
};

export default InstitutionForm;
