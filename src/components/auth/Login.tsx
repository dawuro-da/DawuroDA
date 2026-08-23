"use client";

import { useState } from "react";
import { RemoveRedEyeOutlined } from "@mui/icons-material";
import { Button, CircularProgress, TextField } from "@mui/material";
import { signIn } from "next-auth/react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { FieldValues, useForm } from "react-hook-form";
import { email_regex } from "@/constants/regex";
import Link from "next/link";

const Login = () => {
  const router = useRouter();
  const [loginError, setLoginError] = useState<string>("");
  const [showPassword, setShowPassword] = useState<boolean>(false);
  const [loading, setLoading] = useState<boolean>(false);
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm();

  const handleLogin = async (values: FieldValues) => {
    const { email, password } = values;
    setLoading(true);
    const res = await signIn("credentials", {
      email,
      password,
      redirect: false,
    });

    if (res?.status === 200) {
      window.open("/admin/dashboard", "_parent");
    } else if (res?.status === 401) {
      setLoginError(res.error ?? "Login Error");
    }
    setLoading(false);
  };

  return (
    <div className="flex-1 flex flex-col items-center justify-center bg-white h-screen w-screen">
      <div>
        <div>
          <form
            onSubmit={handleSubmit(handleLogin)}
            className=" flex flex-col gap-2 my-2 min-w-[300px]"
          >
            <div className="flex flex-col gap-2 w-full items-center mb-6">
              <Link href={"/"}>
                <Image
                  src={"/images/dawuroda-logo-256.png"}
                  height={180}
                  width={180}
                  className="w-[200px] h-[200px]"
                  alt="DawuroDA Logo"
                />
              </Link>
              <span className="">Welcome back</span>
            </div>

            <div className="flex flex-col gap-4">
              <div className="flex flex-col gap-2 text-[#555555] h-full ">
                <label>Email Address</label>
                <TextField
                  {...register("email", {
                    required: "Email is required",
                    pattern: {
                      message: "Email is not valid",
                      value: email_regex,
                    },
                  })}
                  variant="outlined"
                  error={Boolean(!!errors.email)}
                  helperText={
                    !!errors.email && errors.email.message?.toString()
                  }
                  inputProps={{
                    style: {
                      padding: 10,
                      borderRadius: "6px",
                    },
                  }}
                />
              </div>
              <div className="flex flex-col gap-[7px] text-[#555555] h-full ">
                <label className="flex flex-row items-center justify-between">
                  <span>Password</span>

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
            </div>
            <span className="my-2 text-red-500 px-3">
              {errors.email?.message
                ? errors.email?.message.toString()
                : errors.password?.message
                ? errors.password?.message.toString()
                : loginError
                ? loginError
                : ""}
            </span>
            <span
              onClick={() => router.push("/gaadmin/forgot-password")}
              className="w-full text-right py-2 hover:underline cursor-pointer"
            >
              Forgot Password?
            </span>
            <Button
              type="submit"
              className="bg-green-500 text-white hover:bg-green-500 border-2 rounded-[16px] p-3 h-[48px]"
            >
              {loading ? (
                <CircularProgress style={{ color: "white" }} />
              ) : (
                "Login"
              )}
            </Button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default Login;
