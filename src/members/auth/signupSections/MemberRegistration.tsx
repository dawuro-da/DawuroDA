import { FieldErrors, FieldValues, UseFormRegister } from "react-hook-form";

interface MemberRegistrationProps {
  register: UseFormRegister<FieldValues>;
  loginError: string;
  setIsSignUp: (value: boolean) => void;
  errors: FieldErrors<FieldValues>;
  handleNext: () => void;
}

const MemberRegistration = ({}: MemberRegistrationProps) => {
  return <div>Hello member</div>;
};

export default MemberRegistration;
