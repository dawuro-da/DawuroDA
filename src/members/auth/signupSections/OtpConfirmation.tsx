import OtpInput from "react-otp-input";
import { Button, CircularProgress, TextField } from "@mui/material";
import { useState } from "react";
import {
  FieldErrors,
  FieldValues,
  UseFormRegister,
  UseFormWatch,
} from "react-hook-form";
import axios from "axios";

interface OtpConfirmationProps {
  handleNext: () => void;
  watch: UseFormWatch<FieldValues>;
}
const OtpConfirmation = ({ handleNext, watch }: OtpConfirmationProps) => {
  const [otp, setOtp] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState<boolean>(false);

  const verifyOtp = async () => {
    setLoading(true);
    try {
      if (!otp) {
        setError("Please enter the OTP code");
        return;
      }
      const res = await axios.post("/api/sms/verifyOtp", {
        code: otp,
        phone: watch("phone"),
      });
      if (res.data.success) {
        handleNext();
      } else {
        setError("Invalid OTP code");
      }
    } catch (err) {
      console.log(err);
      setError("Something Went Wrong");
    }
    setLoading(false);
  };

  return (
    <div className="flex flex-col items-center justify-center gap-4 max-w-[300px] w-full">
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
      <div>
        <span className="text-red-500">{error}</span>
        <Button
          onClick={verifyOtp}
          variant="outlined"
          className="capitalize font-bold bg-primaryColor hover:bg-primaryColor text-white w-full"
        >
          {loading ? <CircularProgress className="text-white" /> : "Confirm"}
        </Button>
      </div>
    </div>
  );
};

export default OtpConfirmation;
