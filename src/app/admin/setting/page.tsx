import Settings from "@/components/settings/Settings";
import { OPTIONS } from "@/util/authOptions";
import { UserRole } from "@prisma/client";
import { getServerSession } from "next-auth";
import { redirect } from "next/navigation";

export default async function SettingPage() {
  const session = await getServerSession(OPTIONS);
  if (!session?.user?.id || session?.user?.role === UserRole.Member) {
    redirect("/gaadmin/login");
  }

  return <Settings />;
}
