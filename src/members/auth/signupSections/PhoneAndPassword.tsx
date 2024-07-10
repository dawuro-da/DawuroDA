import { FacebookRounded, RemoveRedEyeOutlined } from "@mui/icons-material";
import { Button, Divider, TextField } from "@mui/material";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { FieldErrors, FieldValues, UseFormRegister } from "react-hook-form";

interface PhoneAndPasswordProps {
  register: UseFormRegister<FieldValues>;
  loginError: string;
  setIsSignUp: (value: boolean) => void;
  errors: FieldErrors<FieldValues>;
  handleNext: () => void;
}
const PhoneAndPassword = ({
  register,
  loginError,
  setIsSignUp,
  handleNext,
  errors,
}: PhoneAndPasswordProps) => {
  const [showPassword, setShowPassword] = useState<boolean>(false);

  return (
    <div className="px-10 py-20 flex flex-col items-center justify-center gap-4 max-w-[450px] w-full">
      <div className="font-bold text-4xl">Sign Up</div>
      <div className="flex flex-col gap-1 items-center">
        <span className="text-center">Welcome to</span>
        <span className="text-2xl font-[500] text-center">
          Gamo Development Association
        </span>
      </div>
      <div className="flex flex-col gap-1 w-full mt-16">
        <span className="text-titleColor text-sm font-bold">Phone Number</span>
        <TextField
          size="small"
          {...register("phone", {
            required: "Phone Number is required",
          })}
          type="text"
          placeholder="+251..."
          className="border-2 rounded-[16px] py-2"
          inputProps={{ style: { padding: 10 } }}
          error={Boolean(!!errors.phone)}
          helperText={!!errors.phone && errors.phone.message?.toString()}
        />
      </div>
      <div className="flex flex-col gap-[7px] text-[#555555] h-full w-full">
        <label className="flex flex-row items-center justify-between">
          <span className="text-titleColor text-sm font-bold">Password</span>

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
      <Divider title="Or" className="font-extralight w-full" textAlign="center">
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
      </div>
      <Button
        onClick={handleNext}
        variant="outlined"
        className="capitalize font-bold bg-primaryColor hover:bg-primaryColor text-white w-full"
      >
        Sign up
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
