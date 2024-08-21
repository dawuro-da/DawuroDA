"use client";

import { useState } from "react";
import { Button, Checkbox, CircularProgress, TextField } from "@mui/material";
import { useRouter } from "next/navigation";
import { FieldValues, useForm } from "react-hook-form";
import axios from "axios";
import { useDispatch } from "react-redux";
import { showToastAction } from "@/redux/actions";
import OtpConfirmation from "./signupSections/OtpConfirmation";
import MemberPasswordReset from "./MemberPasswordReset";
import { international_phone_regex, phone_regex } from "@/constants/regex";
import { PhoneNumberInput } from "@/components/shared/PhoneNumberInput";

const MemberForgotPassword = () => {
  const router = useRouter();
  const dispatch = useDispatch();
  const [forgotError, setforgotError] = useState<string>("");
  const [loading, setLoading] = useState<boolean>(false);
  const [resetStep, setResetStep] = useState<number>(0);
  const {
    register,
    handleSubmit,
    formState: { errors },
    watch,
    setValue,
  } = useForm();

  const handleForgot = async (values: FieldValues) => {
    setLoading(true);
    try {
      const { phone, email, international } = values;
      const res = await axios.post("/api/member/forgot-password", {
        phone,
        email,
        international,
      });
      if (res.data.success && res.status === 200) {
        handleNextResetStep();
      } else {
        dispatch(showToastAction({ message: res.data.error, type: "error" }));
      }
    } catch (err: any) {
      dispatch(
        showToastAction({
          message: err?.response?.data?.error ?? "something went wrong",
          type: "error",
        })
      );
    }
    setLoading(false);
  };

  const handleNextResetStep = () => {
    setResetStep(resetStep + 1);
  };

  const renderForgetPasswordStep = () => {
    switch (resetStep) {
      case 1:
        return (
          <div className="flex flex-col items-center justify-center h-screen w-full">
            <OtpConfirmation watch={watch} handleNext={handleNextResetStep} />
          </div>
        );
      case 2:
        return (
          <MemberPasswordReset phone={watch("phone")} email={watch("email")} />
        );
      default:
        return (
          <div className="flex-1 flex flex-col items-center justify-center bg-white h-screen w-screen">
            <div>
              <div>
                <form
                  onSubmit={handleSubmit(handleForgot)}
                  className=" flex flex-col gap-2 my-2 min-w-[300px]"
                >
                  <div className="flex flex-col gap-2 w-full  mb-6">
                    <span className="font-extrabold text-3xl text-primaryColor ">
                      Forgot Password
                    </span>
                    <small className="text-titleColor max-w-[400px]">
                      {watch("international")
                        ? `Please enter your Email and you will recieve an OTP code.
                      and please don't share your OTP with anyone.`
                        : `Please enter your phone number and you will recieve an OTP code.
                      and please don't share your OTP with anyone.`}
                    </small>
                  </div>

                  <div className="flex flex-col gap-4">
                    {watch("international") ? (
                      <div className="flex flex-col gap-[7px] text-[#555555] h-full ">
                        <span>Email</span>

                        <TextField
                          {...register("email", {
                            required: "email is required",
                          })}
                          variant="outlined"
                          error={Boolean(!!errors.email)}
                          helperText={
                            !!errors.email && errors.email.message?.toString()
                          }
                          inputProps={{
                            style: {
                              padding: 9,
                              borderRadius: "6px",
                            },
                          }}
                        />
                      </div>
                    ) : (
                      <div className="flex flex-col gap-[7px] text-[#555555] h-full ">
                        <span>Phone</span>

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
                          inputProps={{
                            style: {
                              padding: 9,
                              borderRadius: "6px",
                            },
                          }}
                          value={watch("phone") ?? ""}
                          onChange={(value) => setValue("phone", value.replace(/\s+/g, ""))}
                          type="text"
                          placeholder=""
                          error={Boolean(!!errors.phone)}
                          helperText={
                            !!errors.phone && errors.phone.message?.toString()
                          }
                        />
                      </div>
                    )}
                    <div className="flex flex-row items-center w-full text-titleColor">
                      <Checkbox
                        {...register("international")}
                        checked={Boolean(watch("international"))}
                      />
                      <span>International user</span>
                    </div>
                  </div>
                  <span className="my-2 text-red-500 px-3">
                    {forgotError ? forgotError : ""}
                  </span>
                  <Button
                    variant="contained"
                    type="submit"
                    disabled={loading}
                    className="bg-primaryColor shadow-none text-white hover:bg-primaryColor border-2 rounded-[16px] p-3 h-[48px]"
                  >
                    {loading ? (
                      <CircularProgress style={{ color: "white" }} />
                    ) : (
                      "Send OTP"
                    )}
                  </Button>
                </form>
              </div>
            </div>
          </div>
        );
    }
  };
  return renderForgetPasswordStep();
};

export default MemberForgotPassword;
