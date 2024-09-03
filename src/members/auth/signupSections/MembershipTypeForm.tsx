import { FormControlLabel, Radio, RadioGroup } from "@mui/material";
import { MembershipType } from "@prisma/client";
import { useEffect } from "react";
import {
  FieldErrors,
  FieldValues,
  UseFormRegister,
  UseFormSetValue,
  UseFormWatch,
} from "react-hook-form";
import { useTranslation } from "react-i18next";

interface MembershipTypeFormProps {
  register: UseFormRegister<FieldValues>;
  loginError: string;
  errors: FieldErrors<FieldValues>;
  setValue: UseFormSetValue<FieldValues>;
  watch: UseFormWatch<FieldValues>;
}

const MembershipTypeForm = ({ setValue, watch }: MembershipTypeFormProps) => {
  const { t } = useTranslation();

  useEffect(() => {
    if (!watch("membershipType")) {
      setValue("membershipType", MembershipType.Individual);
    }
  }, []);

  return (
    <>
      <span className="text-3xl font-light tracking-tight mt-12 w-full">
        {`${t("members_dashboard.login.sign_up.progress_bar_1.choose")}`}
      </span>
      <div className="flex flex-col w-full my-10">
        <RadioGroup
          value={watch("membershipType") ?? MembershipType.Individual}
          onChange={(e) => {
            setValue("membershipType", e.target.value);
          }}
          className="flex flex-row items-center gap-6 mb-6"
        >
          <FormControlLabel
            value={MembershipType.Individual}
            control={<Radio size="small" />}
            label={`${t(
              "members_dashboard.login.sign_up.progress_bar_1.individual"
            )}`}
            className="text-titleColor"
          />
          <FormControlLabel
            value={MembershipType.Company}
            control={<Radio size="small" />}
            label={`${t(
              "members_dashboard.login.sign_up.progress_bar_1.company"
            )}`}
            className="text-titleColor"
          />
        </RadioGroup>
      </div>
    </>
  );
};

export default MembershipTypeForm;
