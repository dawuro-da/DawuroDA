"use client";

import { useEffect, useState } from "react";
import { RemoveRedEyeOutlined } from "@mui/icons-material";
import { Button, CircularProgress, TextField } from "@mui/material";
import Image from "next/image";
import { FieldValues, useForm } from "react-hook-form";
import axios from "axios";
import { useDispatch } from "react-redux";
import { showToastAction } from "@/redux/actions";
import { useRouter } from "next/navigation";
import { I18nextProvider, useTranslation } from "react-i18next";
import i18n from "../../../i18n";
import useLanguageStore from "@/redux/languageStore";

const MemberPasswordReset = ({
  phone,
  email,
}: {
  phone?: string;
  email?: string;
}) => {
  const router = useRouter();
  const dispatch = useDispatch();
  const [ResetError, setResetError] = useState<string>("");
  const [showPassword, setShowPassword] = useState<boolean>(false);
  const [loading, setLoading] = useState<boolean>(false);
  const [isSuccessfull, setIsSuccessfull] = useState<boolean>(false);
  const { i18n: i18nn, t } = useTranslation();
  const { language } = useLanguageStore();

  const {
    register,
    handleSubmit,
    formState: { errors },
    watch,
  } = useForm();

  useEffect(() => {
    i18nn.changeLanguage(language);
  }, [language, i18nn]);

  const handleReset = async (values: FieldValues) => {
    const { password } = values;
    setLoading(true);
    const res = await axios.post("/api/member/reset-password", {
      phone,
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
    <I18nextProvider i18n={i18n}>
      <div className="flex-1 flex flex-col items-center justify-center bg-white h-screen w-screen">
        <div>
          <div>
            <form
              onSubmit={handleSubmit(handleReset)}
              className=" flex flex-col gap-2 my-2 min-w-[300px]"
            >
              <div className="flex flex-col gap-2 w-full  mb-6">
                <span className="font-extrabold text-3xl text-primaryColor ">
                  {`${t("members_dashboard.login.reset_password_heading")}`}
                </span>
                <small className="text-titleColor max-w-[400px]">
                  {`${t("members_dashboard.login.reset_password_subheading")}`}
                </small>
              </div>

              {!isSuccessfull && (
                <div className="flex flex-col gap-4">
                  <div className="flex flex-col gap-[7px] text-[#555555] h-full ">
                    <label className="flex flex-row items-center justify-between">
                      <span>{`${t(
                        "members_dashboard.login.new_password"
                      )}`}</span>

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
                        minLength: {
                          value: 6,
                          message: "password must be at least 6 chars",
                        },
                      })}
                      variant="outlined"
                      type={showPassword ? "text" : "password"}
                      error={Boolean(!!errors.password)}
                      helperText={
                        !!errors.password
                          ? errors.password.message?.toString()
                          : "password must be at least 6 chars"
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
                      <span>{`${t(
                        "members_dashboard.login.confirm_password"
                      )}`}</span>

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
                    {`${t("members_dashboard.login.success_message")}`}
                  </span>
                  <Button
                    variant="contained"
                    onClick={() => router.push("/login")}
                    className="bg-primaryColor shadow-none text-white hover:bg-primaryColor border-2 rounded-[16px] p-3 h-[48px]"
                  >
                    {`${t("members_dashboard.login.back_to_login_button")}`}
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
                    `${t("members_dashboard.login.reset")}`
                  )}
                </Button>
              )}
            </form>
          </div>
        </div>
      </div>
    </I18nextProvider>
  );
};

export default MemberPasswordReset;
