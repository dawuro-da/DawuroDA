import { Button, CircularProgress } from "@mui/material";
import Image from "next/image";
import { useEffect, useRef, useState } from "react";
import {
  FieldErrors,
  FieldValues,
  UseFormRegister,
  UseFormSetValue,
  UseFormWatch,
} from "react-hook-form";
import MembershipTypeForm from "./MembershipTypeForm";
import IndividualForm from "./IndividualForm";
import IndividualProfessionalForm from "./IndividualProfessionalForm";
import { MembershipType } from "@prisma/client";
import InstitutionForm from "./InstitutionForm";
import InstitutionProfessionForm from "./InstitutionProfessionForm";
import Success from "./Success";

interface MemberRegistrationProps {
  register: UseFormRegister<FieldValues>;
  loginError: string;
  errors: FieldErrors<FieldValues>;
  watch: UseFormWatch<FieldValues>;
  setValue: UseFormSetValue<FieldValues>;
  loading: boolean;
  isSuccessfull: boolean;
}

const MemberRegistration = ({
  register,
  loginError,
  errors,
  watch,
  setValue,
  loading,
  isSuccessfull,
}: MemberRegistrationProps) => {
  const btnRef = useRef<HTMLButtonElement | null>(null);
  const [currentStep, setCurrentStep] = useState(1);
  const steps = [
    { label: "Membership Type", step: 1 },
    { label: "Personal Info", step: 2 },
    { label: "Professional Info", step: 3 },
    { label: "Success", step: 4 },
  ];

  useEffect(() => {
    if (isSuccessfull) {
      setCurrentStep(currentStep + 1);
    }
  }, [isSuccessfull]);

  const renderForm = (step: number) => {
    switch (step) {
      case 1:
        return (
          <MembershipTypeForm
            register={register}
            errors={errors}
            loginError={loginError}
            setValue={setValue}
            watch={watch}
          />
        );
      case 2:
        return watch("membershipType") !== MembershipType.Company ? (
          <IndividualForm
            register={register}
            errors={errors}
            loginError={loginError}
            watch={watch}
          />
        ) : (
          <InstitutionForm
            register={register}
            errors={errors}
            loginError={loginError}
            watch={watch}
          />
        );
      case 3:
        return watch("membershipType") !== MembershipType.Company ? (
          <IndividualProfessionalForm
            register={register}
            errors={errors}
            loginError={loginError}
            watch={watch}
          />
        ) : (
          <InstitutionProfessionForm
            register={register}
            errors={errors}
            loginError={loginError}
            watch={watch}
          />
        );

      default:
        return <Success watch={watch} />;
    }
  };

  const handleNextStep = () => {
    switch (currentStep) {
      case 2:
        if (!checkEmptyField({ watch })) {
          return btnRef.current?.click();
        } else {
          return setCurrentStep(currentStep + 1);
        }
      case 3:
        return btnRef.current?.click();
      default:
        setCurrentStep(currentStep + 1);
    }
  };

  return (
    <div
      style={{
        ...(currentStep === 4 && {
          backgroundImage: "url('/images/birthDayDecoration.svg')",
        }),
      }}
      className="px-10 flex flex-col items-center  gap-6 h-full w-full overflow-y-auto hiddenscrollbar py-12"
    >
      <div className="flex flex-col gap-2 w-full">
        <span className="tracking-tight">Gamo Development Association</span>
        <span className="text-3xl font-bold tracking-tight">
          Registration Form
        </span>
      </div>
      <div className=" flex flex-row items-center w-full min-h-[120px] gap-2 justify-between mt-2 overflow-hidden">
        {steps.map((item, index) => {
          const isActive = Boolean(item.step <= currentStep);
          const isDone = Boolean(item.step < currentStep);
          return (
            <div
              key={index}
              className={`relative ${
                !(index === 0) && "flex-1"
              } flex flex-row justify-end`}
            >
              <div
                className={`rounded-full ${
                  isActive
                    ? isDone
                      ? "bg-primaryColor text-white"
                      : "border-primaryColor text-primaryColor bg-white"
                    : "border-[#dadada] text-titleColor bg-white"
                } border-2 flex flex-row z-20  font-bold
              items-center justify-center h-[50px] w-[50px]`}
              >
                {isDone ? (
                  <Image
                    src={"/icons/tickWhite.svg"}
                    alt=""
                    height={25}
                    width={25}
                  />
                ) : (
                  item.step
                )}
              </div>
              {index !== 0 && (
                <div
                  className={`md:block hidden
                    ${
                      isActive ? "border-primaryColor" : "border-[#dadada]"
                    } border-b-2 w-[98%] absolute z-10 h-full bottom-4`}
                />
              )}
              <div
                className={`md:block hidden
                    ${
                      isActive ? "text-primaryColor" : "text-titleColor"
                    }  absolute z-10 min-w-[150px] h-fit -bottom-8 ${
                  index === 0 ? "left-0 right-6" : "-right-16 left-0"
                }justify-end`}
              >
                {item.label}
              </div>
            </div>
          );
        })}
      </div>
      <div className="w-full mt-10">{renderForm(currentStep)}</div>
      <div className="w-full flex flex-row items-center justify-between mt-12">
        {currentStep > 1 && currentStep < 4 ? (
          <Button
            className="px-10 text-[#6c6c6c] border-[#6c6c6c] shadow-none"
            variant="outlined"
            onClick={() => {
              setCurrentStep(currentStep - 1);
            }}
          >
            Back
          </Button>
        ) : (
          <span></span>
        )}
        <button ref={btnRef} type="submit" className="hidden" />

        {currentStep < 4 && (
          <Button
            className="px-10 shadow-none"
            variant="contained"
            onClick={handleNextStep}
          >
            {loading ? <CircularProgress className="text-white" /> : "Next"}
          </Button>
        )}
      </div>
    </div>
  );
};

export default MemberRegistration;

const checkEmptyField = ({ watch }: { watch: UseFormWatch<FieldValues> }) => {
  if (watch("membershipType") === MembershipType.Individual) {
    if (
      !watch("firstName") ||
      !watch("lastName") ||
      !watch("phone") ||
      !watch("gender") ||
      !watch("dateOfBirth") ||
      !watch("region") ||
      !watch("zone") ||
      !watch("city") ||
      !watch("kebele") ||
      !watch("workPlace") ||
      !watch("idNumber") ||
      !watch("branch") ||
      !watch("profileImage")
    ) {
      return false;
    } else {
      return true;
    }
  } else if (watch("membershipType") === MembershipType.Company) {
    if (
      !watch("institutionName") ||
      !watch("headOrRepresentative") ||
      !watch("fieldOfWork") ||
      !watch("phone") ||
      !watch("partnershipIdea") ||
      !watch("region") ||
      !watch("zone") ||
      !watch("city") ||
      !watch("kebele")
    ) {
      return false;
    } else {
      return true;
    }
  } else {
    return false;
  }
};

function isEmpty(obj: any) {
  return Object.keys(obj).length === 0;
}
