"use client";

import { useRouter } from "next/navigation";
import { useRef, useState } from "react";
import { FieldValues, useForm } from "react-hook-form";
import OtpConfirmation from "./signupSections/OtpConfirmation";
import PhoneAndPassword from "./signupSections/PhoneAndPassword";
import MemberRegistration from "./signupSections/MemberRegistration";

const MemberSignup = ({
  setIsSignUp,
}: {
  setIsSignUp: (value: boolean) => void;
}) => {
  const router = useRouter();
  const formRef = useRef<HTMLFormElement | null>(null);
  const [signUpStep, setSignUpStep] = useState(0);
  const [loginError, setLoginError] = useState<string>("");
  const [loading, setLoading] = useState<boolean>(false);
  const {
    register,
    formState: { errors },
    watch,
    setValue,
    handleSubmit,
  } = useForm();

  const handleNext = () => {
    if (signUpStep === 3) {
      formRef.current?.submit();
    } else {
      setSignUpStep(signUpStep + 1);
    }
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
          />
        );
      case 1:
        return (
          <OtpConfirmation
            register={register}
            errors={errors}
            setIsSignUp={setIsSignUp}
            handleNext={handleNext}
            watch={watch}
          />
        );
      default:
        return (
          <MemberRegistration
            register={register}
            loginError={loginError}
            errors={errors}
            setIsSignUp={setIsSignUp}
            handleNext={handleNext}
            watch={watch}
            setValue={setValue}
          />
        );
    }
  };

  const handleRegister = async (values: FieldValues) => {
    try {
      console.log({ values });
      setSignUpStep(signUpStep + 1);
    } catch (err) {
      console.log({ err });
    }
  };

  return (
    <form
      ref={formRef}
      onSubmit={handleSubmit(handleRegister)}
      className="flex flex-col items-center justify-center gap-4 h-full w-full"
    >
      {renderSteps(signUpStep)}
    </form>
  );
};

export default MemberSignup;
