"use client";

import { PhoneNumberInput } from "@/components/shared/PhoneNumberInput";
import { international_phone_regex } from "@/constants/regex";
import {
  ArrowBack,
  Facebook,
  FacebookRounded,
  RemoveRedEyeOutlined,
} from "@mui/icons-material";
import { Button, CircularProgress, Divider, TextField } from "@mui/material";
import { signIn } from "next-auth/react";
import Image from "next/image";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { useState } from "react";
import { FieldValues, useForm } from "react-hook-form";
import { useTranslation } from "react-i18next";

const MemberLogin = ({
  setIsSignUp,
}: {
  setIsSignUp: (value: boolean) => void;
}) => {
  const { t } = useTranslation();
  const params = useSearchParams();
  const [loginError, setLoginError] = useState<string>("");
  const [showPassword, setShowPassword] = useState<boolean>(false);
  const [loading, setLoading] = useState<boolean>(false);
  const {
    register,
    formState: { errors },
    handleSubmit,
    watch,
    setValue,
  } = useForm();

  const handleLogin = async (values: FieldValues) => {
    const { phone, password } = values;
    setLoading(true);
    const res = await signIn("credentials", {
      email: phone,
      password,
      redirect: false,
    });

    if (res?.status === 200) {
      if (params.get("redirect_to")) {
        window.open(
          params.get("redirect_to") ?? "/member/dashboard",
          "_parent"
        );
      } else {
        window.open("/member/dashboard", "_parent");
      }
    } else if (res?.status === 401) {
      setLoginError(res.error ?? "Login Error");
    }
    setLoading(false);
  };

  return (
    <form
      onSubmit={handleSubmit(handleLogin)}
      className="relative px-10 py-20 xl:lg:mt-0 mt-10 flex flex-col items-center justify-center gap-4 max-w-[600px]"
    >
      <Link href={"/"}>
        <div className="absolute xl:lg:hidden flex flex-row items-center gap-2 top-10 left-10 text-black w-fit z-40 hover:cursor-pointer hover:underline">
          <ArrowBack />
          <span>{t("members_dashboard.login.back_to_home")}</span>
        </div>
      </Link>
      <div className="font-bold text-4xl">
        {t("members_dashboard.login.login_button")}
      </div>
      <div className="flex flex-col gap-1 items-center">
        <span className="text-center">
          {t("members_dashboard.login.welcome_back_to")}
        </span>
        <span className="text-2xl font-[500] text-center">
          {t("members_dashboard.login.gamo_development_association")}
        </span>
      </div>
      <div className="flex flex-col gap-1 w-full mt-16">
        <span className="text-titleColor text-sm font-bold">
          {t("members_dashboard.login.phone_number")}
        </span>
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
            {t("members_dashboard.login.password")}
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
      <span className="my-2 text-red-500 px-3">
        {errors.email?.message
          ? errors.email?.message.toString()
          : errors.password?.message
          ? errors.password?.message.toString()
          : loginError
          ? loginError
          : ""}
      </span>
      <div className="flex flex-row items-center justify-end w-full">
        <Link href={"/member/forgot-password"}>
          <span className="text-[#13A6D9] hover:underline">
            {t("members_dashboard.login.forgot_password")}
          </span>
        </Link>
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
      <Button
        type="submit"
        variant="outlined"
        className="capitalize font-bold bg-primaryColor hover:bg-primaryColor text-white w-full"
      >
        {loading ? <CircularProgress className="text-white" /> : "Login"}
      </Button>
      <div className="flex flex-row items-center gap-2 justify-end w-full">
        <span>{t("members_dashboard.login.are_you_new_here")}</span>

        <span
          onClick={() => setIsSignUp(true)}
          className="text-[#13A6D9] hover:underline cursor-pointer"
        >
          {t("members_dashboard.login.sign_up_link")}
        </span>
      </div>
    </form>
  );
};

export default MemberLogin;
