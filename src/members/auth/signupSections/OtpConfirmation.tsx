import OtpInput from "react-otp-input";
import { Button, TextField } from "@mui/material";
import { useState } from "react";
import { FieldErrors, FieldValues, UseFormRegister } from "react-hook-form";

interface OtpConfirmationProps {
  register: UseFormRegister<FieldValues>;
  loginError: string;
  setIsSignUp: (value: boolean) => void;
  errors: FieldErrors<FieldValues>;
  handleNext: () => void;
}
const OtpConfirmation = ({
  register,
  loginError,
  setIsSignUp,
  handleNext,
  errors,
}: OtpConfirmationProps) => {
  const [showPassword, setShowPassword] = useState<boolean>(false);
  const [otp, setOtp] = useState("");

  return (
    <div className="flex flex-col items-center justify-center gap-4 max-w-[600px] w-full">
      <div className="font-bold text-3xl">OTP Confirmation</div>
      <span className="max-w-[250px] text-black text-center">
        {`We've sent you confirmation text to your phone`}
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
      <Button
        onClick={handleNext}
        variant="outlined"
        className="capitalize font-bold bg-primaryColor hover:bg-primaryColor text-white w-full"
      >
        Confirm
      </Button>
    </div>
  );
};

export default OtpConfirmation;
