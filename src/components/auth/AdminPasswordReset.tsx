"use client";

import { useState } from "react";
import { RemoveRedEyeOutlined } from "@mui/icons-material";
import { Button, CircularProgress, TextField } from "@mui/material";
import Image from "next/image";
import { FieldValues, useForm } from "react-hook-form";
import axios from "axios";
import { useDispatch } from "react-redux";
import { showToastAction } from "@/redux/actions";
import { useRouter } from "next/navigation";

const AdminPasswordReset = ({ email }: { email: string }) => {
  const router = useRouter();
  const dispatch = useDispatch();
  const [ResetError, setResetError] = useState<string>("");
  const [showPassword, setShowPassword] = useState<boolean>(false);
  const [loading, setLoading] = useState<boolean>(false);
  const [isSuccessfull, setIsSuccessfull] = useState<boolean>(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
    watch,
  } = useForm();

  const handleReset = async (values: FieldValues) => {
    const { password } = values;
    setLoading(true);
    const res = await axios.post("/api/user/reset-password", {
      email,
      password,
    });

    if (res.data.success && res.status === 200) {
      setIsSuccessfull(true);
    } else {
      setResetError(res.data.error);
      dispatch(showToastAction({ message: res.data.error, type: "error" }));
    }
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

            {!isSuccessfull && (
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
                      required: "Confirm password is required",
                      validate: {
                        passwordsMatch: (value) => {
                          if (value !== watch("password")) {
                            return "Confirm password don't match with password ";
                          }
                          return true;
                        },
                      },
                    })}
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
              </div>
            )}
            {isSuccessfull && (
              <span className="flex flex-col gap-6">
                <span className="text-primaryColor text-xl max-w-[350px]">
                  You have successfully resetted your password
                </span>
                <Button
                  variant="contained"
                  onClick={() => router.push("/gaadmin/login")}
                  className="bg-primaryColor shadow-none text-white hover:bg-primaryColor border-2 rounded-[16px] p-3 h-[48px]"
                >
                  Back to login
                </Button>
              </span>
            )}
            <span className="my-2 text-red-500 px-3">
              {ResetError ? ResetError : ""}
            </span>

            {!isSuccessfull && (
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
            )}
          </form>
        </div>
      </div>
    </div>
  );
};

export default AdminPasswordReset;
