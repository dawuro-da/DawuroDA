import Image from "next/image";
import { useState } from "react";
import { FieldErrors, FieldValues, UseFormRegister } from "react-hook-form";

interface MemberRegistrationProps {
  register: UseFormRegister<FieldValues>;
  loginError: string;
  setIsSignUp: (value: boolean) => void;
  errors: FieldErrors<FieldValues>;
  handleNext: () => void;
}

const MemberRegistration = ({}: MemberRegistrationProps) => {
  const [currentStep, setCurrentStep] = useState(2);

  return (
    <div className="flex flex-col items-center justify-center  gap-6 h-full w-full">
      <div className="flex flex-col gap-2 w-full">
        <span className="tracking-tight">Gamo Development Association</span>
        <span className="text-3xl font-bold tracking-tight">
          Registration Form
        </span>
      </div>
      <div className=" flex flex-row items-center w-full gap-2 justify-between mt-2">
        {[1, 2, 3, 4].map((item, index) => {
          const isActive = Boolean(item <= currentStep);
          const isDone = Boolean(item < currentStep);
          return (
            <div
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
                  item
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
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default MemberRegistration;
