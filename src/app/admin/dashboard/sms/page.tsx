import WorkingOnPage from "@/components/shared/WorkingOnPage";
import SMS from "@/components/sms/SMS";
import { OPTIONS } from "@/util/authOptions";
import { UserRole } from "@prisma/client";
import { getServerSession } from "next-auth";
import { redirect } from "next/navigation";

export default async function SMSPage() {
  const session = await getServerSession(OPTIONS);
  if (!session?.user?.id || session?.user?.role === UserRole.Member) {
    redirect("/gaadmin/login");
  }
  return <SMS />;
}
