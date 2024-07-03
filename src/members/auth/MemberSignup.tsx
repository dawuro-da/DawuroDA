"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import { useForm } from "react-hook-form";
import OtpConfirmation from "./signupSections/OtpConfirmation";
import PhoneAndPassword from "./signupSections/PhoneAndPassword";
import MemberRegistration from "./signupSections/MemberRegistration";

const MemberSignup = ({
  setIsSignUp,
}: {
  setIsSignUp: (value: boolean) => void;
}) => {
  const router = useRouter();
  const [signUpStep, setSignUpStep] = useState(0);
  const [loginError, setLoginError] = useState<string>("");
  const [loading, setLoading] = useState<boolean>(false);
  const {
    register,
    formState: { errors },
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
            loginError={loginError}
            errors={errors}
            setIsSignUp={setIsSignUp}
            handleNext={handleNext}
          />
        );
      case 1:
        return (
          <OtpConfirmation
            register={register}
            loginError={loginError}
            errors={errors}
            setIsSignUp={setIsSignUp}
            handleNext={handleNext}
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
          />
        );
    }
  };
  return (
    <form className="px-10 flex flex-col items-center justify-center gap-4 h-full w-full ">
      {renderSteps(signUpStep)}
    </form>
  );
};

export default MemberSignup;
