import AdminPasswordReset from "@/components/auth/AdminPasswordReset";
import { findUserByToken } from "@/db/user";
import { redirect } from "next/navigation";

const PasswordResetPage = async ({ params }: { params: { token: string } }) => {
  const user = await findUserByToken(params.token);
  if (!user) {
    redirect("/gaadmin/login");
  }
  return <AdminPasswordReset email={user.email} />;
};

export default PasswordResetPage;
