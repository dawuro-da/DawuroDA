import { redirect } from "next/navigation";
import { OPTIONS } from "@/util/authOptions";
import { UserRole } from "@prisma/client";
import { getServerSession } from "next-auth";

export default async function Admin() {
  const session = await getServerSession(OPTIONS);
  if (!session?.user?.id) {
    redirect("/daadmin/login");
  } else if (session?.user?.role === UserRole.Member) {
    redirect("/member/dashboard");
  }

  return redirect("/admin/dashboard");
}
