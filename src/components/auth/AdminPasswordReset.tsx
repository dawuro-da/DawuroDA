"use client";

import { useState } from "react";
import { RemoveRedEyeOutlined } from "@mui/icons-material";
import { Button, CircularProgress, TextField } from "@mui/material";
import { signIn } from "next-auth/react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { FieldValues, useForm } from "react-hook-form";

const AdminPasswordReset = () => {
  const router = useRouter();
  const [ResetError, setResetError] = useState<string>("");
  const [showPassword, setShowPassword] = useState<boolean>(false);
  const [loading, setLoading] = useState<boolean>(false);
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm();

  const handleReset = async (values: FieldValues) => {
    const { email, password } = values;
    setLoading(true);
    
    setLoading(false);
  };

  return (
    <div className="flex-1 flex flex-col items-center justify-center bg-white h-screen w-screen">
      <div>
        <div>
          <form
            onSubmit={handleSubmit(handleReset)}
            className=" flex flex-col gap-2 my-2 min-w-[300px]"
          >
            <div className="flex flex-col gap-2 w-full  mb-6">
              <span className="font-extrabold text-3xl text-primaryColor ">
                Reset Password
              </span>
              <small className="text-titleColor max-w-[400px]">
                Reset your password here. and please make sure your new password
                matchs with confirm password
              </small>
            </div>

            <div className="flex flex-col gap-4">
              <div className="flex flex-col gap-[7px] text-[#555555] h-full ">
                <label className="flex flex-row items-center justify-between">
                  <span>New Password</span>

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
                  helperText={
                    !!errors.password && errors.password.message?.toString()
                  }
                  inputProps={{
                    style: {
                      padding: 9,
                      borderRadius: "6px",
                    },
                  }}
                />
              </div>
              <div className="flex flex-col gap-[7px] text-[#555555] h-full ">
                <label className="flex flex-row items-center justify-between">
                  <span>Confirm Password</span>

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
                    required: "confirm Password is required",
                  })}
                  variant="outlined"
                  type={showPassword ? "text" : "password"}
                  error={Boolean(!!errors.password)}
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
            </div>
            <span className="my-2 text-red-500 px-3">
              {ResetError ? ResetError : ""}
            </span>

            <Button
              variant="contained"
              type="submit"
              className="bg-primaryColor shadow-none text-white hover:bg-primaryColor border-2 rounded-[16px] p-3 h-[48px]"
            >
              {loading ? (
                <CircularProgress style={{ color: "white" }} />
              ) : (
                "Reset"
              )}
            </Button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default AdminPasswordReset;
