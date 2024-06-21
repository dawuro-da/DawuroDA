import { redirect } from "next/navigation";
import { OPTIONS } from "@/util/authOptions";
import { UserRole } from "@prisma/client";
import { getServerSession } from "next-auth";

export default async function Gaadmin() {
  const session = await getServerSession(OPTIONS);
  if (!session?.user?.id || session?.user?.role === UserRole.Member) {
    redirect("/gaadmin/login");
  }
  return redirect("/admin/dashboard");
}
