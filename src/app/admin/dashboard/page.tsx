import Dashboard from "@/components/dashboard/Dashboard";
import { OPTIONS } from "@/util/authOptions";
import { UserRole } from "@prisma/client";
import { getServerSession } from "next-auth";
import { redirect } from "next/navigation";

export default async function Page() {
  const session = await getServerSession(OPTIONS);
  if (!session?.user || session?.user.role === UserRole.Member) {
    redirect("/daadmin/login");
  } else if (session?.user?.role === UserRole.Admin) {
    redirect("/admin/dashboard/members");
  }

  return <Dashboard />;
}
