"use client";

import { useState } from "react";
import { FieldValues, useForm } from "react-hook-form";
import OtpConfirmation from "./signupSections/OtpConfirmation";
import PhoneAndPassword from "./signupSections/PhoneAndPassword";
import MemberRegistration from "./signupSections/MemberRegistration";
import axios from "axios";
import { useDispatch } from "react-redux";
import { showToastAction } from "@/redux/actions";
import { getMemberFormData } from "@/util/getMemberFormData";
import { PaymentMeans } from "@prisma/client";

const MemberSignup = ({
  setIsSignUp,
}: {
  setIsSignUp: (value: boolean) => void;
}) => {
  const dispatch = useDispatch();
  const [signUpStep, setSignUpStep] = useState(0);
  const [loginError, setLoginError] = useState<string>("");
  const [loading, setLoading] = useState<boolean>(false);
  const [isSuccessFull, setIsSuccessfull] = useState<boolean>(false);
  const {
    register,
    formState: { errors },
    watch,
    setValue,
    handleSubmit,
  } = useForm();

  const handleNext = () => {
    setSignUpStep(signUpStep + 1);
  };

  const renderSteps = (currentStep: number) => {
    switch (currentStep) {
      case 0:
        return (
          <PhoneAndPassword
            register={register}
            errors={errors}
            setIsSignUp={setIsSignUp}
            handleNext={handleNext}
            watch={watch}
            setValue={setValue}
          />
        );
      case 1:
        return <OtpConfirmation handleNext={handleNext} watch={watch} />;
      default:
        return (
          <MemberRegistration
            register={register}
            loginError={loginError}
            errors={errors}
            watch={watch}
            setValue={setValue}
            loading={loading}
            isSuccessfull={isSuccessFull}
            setIsSignUp={setIsSignUp}
          />
        );
    }
  };

  const handleRegister = async (values: FieldValues) => {
    setLoading(true);
    try {
      const formData = getMemberFormData({
        ...values,
        paymentMeans: PaymentMeans.Other,
      });
      const res = await axios.post("/api/tempMember/register", formData);
      if (res.data.success) {
        setLoginError("");
        setIsSuccessfull(true);
      } else {
        setLoginError(res.data.error ?? "Unable to complete registration");
        dispatch(
          showToastAction({
            message: res.data.error ?? "Unable to complete registration",
            type: "error",
          })
        );
      }
    } catch (err: any) {
      const message =
        err?.response?.data?.error ?? "Unable to complete registration";
      setLoginError(message);
      dispatch(showToastAction({ message, type: "error" }));
      console.error({ err });
    }
    setLoading(false);
  };

  return (
    <form
      onSubmit={handleSubmit(handleRegister)}
      className="flex flex-col items-center justify-center gap-4 h-full w-full"
    >
      {renderSteps(signUpStep)}
    </form>
  );
};

export default MemberSignup;
