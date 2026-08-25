import WorkingOnPage from "@/components/shared/WorkingOnPage";
import SMS from "@/components/sms/SMS";
import { OPTIONS } from "@/util/authOptions";
import { UserRole } from "@prisma/client";
import { getServerSession } from "next-auth";
import { redirect } from "next/navigation";

export default async function SMSPage() {
  const session = await getServerSession();
  if (!session?.user || session?.user.role === UserRole.Member) {
    redirect("/daadmin/login");
  } else if (session?.user?.role === UserRole.Admin) {
    redirect("/admin/dashboard/members");
  }

  return <SMS />;
}
