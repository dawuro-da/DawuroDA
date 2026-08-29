import OtpInput from "react-otp-input";
import { Button, CircularProgress } from "@mui/material";
import { useState } from "react";
import { FieldValues, UseFormWatch } from "react-hook-form";
import axios from "axios";
import { useTranslation } from "react-i18next";
import { useRouter } from "next/navigation";

interface OtpConfirmationProps {
  handleNext: () => void;
  watch: UseFormWatch<FieldValues>;
  backHref?: string;
}
const OtpConfirmation = ({
  handleNext,
  watch,
  backHref,
}: OtpConfirmationProps) => {
  const router = useRouter();
  const [otp, setOtp] = useState("");
  const [error, setError] = useState("");
  const { t } = useTranslation();
  const [loading, setLoading] = useState<boolean>(false);

  const verifyOtp = async () => {
    setLoading(true);
    try {
      if (!otp) {
        setError("Please enter the OTP code");
        return;
      }
      const res = watch("international")
        ? await axios.post("/api/email/verifyOTPConfirmation", {
            OTP: otp,
          })
        : await axios.post("/api/sms/verifyOtp", {
            code: otp,
            phone: watch("phone"),
          });
      if (res.data.success) {
        handleNext();
      } else {
        setError("Invalid OTP code");
      }
    } catch (err) {
      console.error(err);
      setError("Something Went Wrong");
    }
    setLoading(false);
  };

  return (
    <div className="flex flex-col items-center justify-center gap-4 max-w-[300px] w-full">
      <div className="font-bold text-3xl">
        {t("members_dashboard.login.otp_confirmation_heading")}
      </div>
      <span className="max-w-[250px] text-black text-center">
        {watch("international")
          ? `${t("members_dashboard.login.otp_confirmation_email_subheading")}`
          : `${t("members_dashboard.login.otp_confirmation_phone_subheading")}`}
      </span>
      <div className="w-full flex flex-row mt-14 mb-14">
        <OtpInput
          value={otp}
          onChange={setOtp}
          inputStyle={{
            border: "1px solid black",
            width: 50,
            height: 50,
            marginLeft: 10,
            marginRight: 10,
            color: "black",
            borderRadius: 5,
          }}
          containerStyle={{ color: "black" }}
          numInputs={4}
          renderInput={(props) => {
            return <input {...props} />;
          }}
        />
      </div>
      <div>
        <span className="text-red-500">{error}</span>
        <Button
          onClick={verifyOtp}
          variant="outlined"
          className="capitalize font-bold bg-primaryColor hover:bg-primaryColor text-white w-full"
        >
          {loading ? (
            <CircularProgress className="text-white" />
          ) : (
            `${t("members_dashboard.login.confirm_button")}`
          )}
        </Button>
        {backHref && (
          <div className="flex flex-row items-center justify-center gap-2 mt-2">
            <span
              onClick={() => router.push(backHref)}
              className="text-green-500 cursor-pointer"
            >
              {"Back to Login"}
            </span>
          </div>
        )}
      </div>
    </div>
  );
};

export default OtpConfirmation;
