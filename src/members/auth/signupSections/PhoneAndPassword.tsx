import { PhoneNumberInput } from "@/components/shared/PhoneNumberInput";
import { international_phone_regex } from "@/constants/regex";
import { RemoveRedEyeOutlined } from "@mui/icons-material";
import { Button, Checkbox, CircularProgress, TextField } from "@mui/material";
import axios from "axios";
import Image from "next/image";
import { useState } from "react";
import {
  FieldErrors,
  FieldValues,
  UseFormRegister,
  UseFormSetValue,
  UseFormWatch,
} from "react-hook-form";

interface PhoneAndPasswordProps {
  register: UseFormRegister<FieldValues>;
  setIsSignUp: (value: boolean) => void;
  errors: FieldErrors<FieldValues>;
  handleNext: () => void;
  watch: UseFormWatch<FieldValues>;
  setValue: UseFormSetValue<FieldValues>;
}
const PhoneAndPassword = ({
  register,
  setIsSignUp,
  handleNext,
  watch,
  errors,
  setValue,
}: PhoneAndPasswordProps) => {
  const [showPassword, setShowPassword] = useState<boolean>(false);
  const [error, setError] = useState<string>("");
  const [loading, setLoading] = useState<boolean>(false);

  const sendOtp = async () => {
    setLoading(true);
    try {
      if (!watch("phone") || !watch("password")) {
        setError("Phone and password are required");
        setLoading(false);
        return;
      }
      if (watch("password") !== watch("confirmPassword")) {
        setError("Password must match confirm password");
        setLoading(false);
        return;
      }
      if (watch("international") && !watch("email")) {
        setError("Email is required for international user");
        setLoading(false);
        return;
      }
      if (watch("international")) {
        if (!international_phone_regex.test(watch("phone"))) {
          setError("Phone is not valid");
          setLoading(false);
          return;
        }
      }

      const res = await axios.post("/api/member/checkToRegister", {
        phone: watch("phone"),
        email: watch("email"),
        isInternational: watch("international"),
      });

      if (res.data.success) {
        handleNext();
      } else {
        setError(res.data.error);
      }
    } catch (err: any) {
      console.error({ err });
      if (err?.response?.data?.error) setError(err?.response?.data?.error);
    }
    setLoading(false);
  };

  return (
    <div className="px-10 py-20 flex flex-col items-center justify-center gap-4 max-w-[450px] w-full">
      <div className="font-bold text-4xl">Sign Up</div>
      <div className="flex flex-col gap-1 items-center">
        <span className="text-center">Welcome to</span>
        <span className="text-2xl font-[500] text-center">
          Gamo Development Association
        </span>
      </div>
      <div className="flex flex-col gap-1 w-full mt-12">
        <span className="text-titleColor text-sm font-bold">
          {"Email (optional for local users)"}
        </span>
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
      <div className="flex flex-col gap-1 w-full">
        <span className="text-titleColor text-sm font-bold">Phone Number</span>
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
          error={Boolean(!!errors.phone)}
          helperText={!!errors.phone && errors.phone.message?.toString()}
        />
      </div>
      <div className="flex flex-col gap-[7px] text-[#555555] h-full w-full">
        <label className="flex flex-row items-center justify-between">
          <span className="text-titleColor text-sm font-bold">
            New Password
          </span>

          {showPassword ? (
            <Image
              onClick={() => setShowPassword(!showPassword)}
              src={"/icons/hideEye.svg"}
              alt=""
              className="cursor-pointer"
              height={20}
              width={20}
            />
          ) : (
            <RemoveRedEyeOutlined
              onClick={() => setShowPassword(!showPassword)}
              className="cursor-pointer"
              style={{ height: 20, width: 20 }}
            />
          )}
        </label>
        <TextField
          {...register("password", {
            required: "Password is required",
          })}
          autoComplete="off"
          variant="outlined"
          type={showPassword ? "text" : "password"}
          error={Boolean(!!errors.password)}
          helperText={!!errors.password && errors.password.message?.toString()}
          inputProps={{
            style: {
              padding: 9,
              borderRadius: "6px",
            },
          }}
        />
      </div>
      <div className="flex flex-col gap-[7px] text-[#555555] h-full w-full">
        <label className="flex flex-row items-center justify-between">
          <span className="text-titleColor text-sm font-bold">
            Confirm Password
          </span>

          {showPassword ? (
            <Image
              onClick={() => setShowPassword(!showPassword)}
              src={"/icons/hideEye.svg"}
              alt=""
              className="cursor-pointer"
              height={20}
              width={20}
            />
          ) : (
            <RemoveRedEyeOutlined
              onClick={() => setShowPassword(!showPassword)}
              className="cursor-pointer"
              style={{ height: 20, width: 20 }}
            />
          )}
        </label>
        <TextField
          {...register("confirmPassword", {
            required: "Confirm Password is required",
          })}
          autoComplete="off"
          variant="outlined"
          type={showPassword ? "text" : "password"}
          error={Boolean(!!errors.confirmPassword)}
          helperText={
            !!errors.confirmPassword &&
            errors.confirmPassword.message?.toString()
          }
          inputProps={{
            style: {
              padding: 9,
              borderRadius: "6px",
            },
          }}
        />
      </div>
      {/* <Divider title="Or" className="font-extralight w-full" textAlign="center">
        Or
      </Divider>
      <div className="flex xl:lg:flex-row md:flex-row flex-col items-center gap-4 w-full">
        <div className="w-full flex flex-row items-center justify-center gap-4 border-[1px] px-10 p-2 rounded-[5px]">
          <FacebookRounded
            style={{ height: 25, width: 25, color: "#1877F2" }}
          />
          <span>Facebook</span>
        </div>
        <div className="flex flex-row items-center justify-center w-full gap-4 border-[1px] px-10 p-2 rounded-[5px]">
          <Image
            src={"/icons/googleIcon.svg"}
            alt=""
            height={25}
            width={25}
            style={{ height: 25, width: 25, color: "#1877F2" }}
          />
          <span>Google</span>
        </div>
      </div> */}
      <div className="flex flex-row items-center w-full text-titleColor">
        <Checkbox
          {...register("international")}
          checked={Boolean(watch("international"))}
        />
        <span>International user</span>
      </div>
      <span className="text-red-500">{error}</span>
      <Button
        onClick={sendOtp}
        variant="outlined"
        className="capitalize font-bold bg-primaryColor hover:bg-primaryColor text-white w-full"
      >
        {loading ? <CircularProgress className="text-white" /> : "Sign up"}
      </Button>
      <div className="flex flex-row items-center gap-2 justify-end w-full">
        <span>have an account?</span>
        <span
          onClick={() => setIsSignUp(false)}
          className="text-[#13A6D9] hover:underline cursor-pointer"
        >
          Log in
        </span>
      </div>
    </div>
  );
};

export default PhoneAndPassword;
