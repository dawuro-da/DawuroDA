import MemberForgotPassword from "@/members/auth/MemberForgotPassword";
import { OPTIONS } from "@/util/authOptions";
import { getServerSession } from "next-auth";
import { redirect } from "next/navigation";

const MemberForgotPasswordPage = async () => {
  const session = await getServerSession(OPTIONS);
  if (session?.user.id) {
    redirect("/member/dashboard");
  }

  return <MemberForgotPassword />;
};

export default MemberForgotPasswordPage;
