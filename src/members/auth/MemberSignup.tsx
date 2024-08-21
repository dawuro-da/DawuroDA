"use client";

import { useState } from "react";
import { FieldValues, useForm } from "react-hook-form";
import OtpConfirmation from "./signupSections/OtpConfirmation";
import PhoneAndPassword from "./signupSections/PhoneAndPassword";
import MemberRegistration from "./signupSections/MemberRegistration";
import axios from "axios";
import { getMemberFormData } from "@/util/getMemberFormData";
import { PaymentMeans } from "@prisma/client";

const MemberSignup = ({
  setIsSignUp,
}: {
  setIsSignUp: (value: boolean) => void;
}) => {
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
        setIsSuccessfull(true);
        window.open(res.data.value.data.checkout_url, "_blank");
      }
    } catch (err) {
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
