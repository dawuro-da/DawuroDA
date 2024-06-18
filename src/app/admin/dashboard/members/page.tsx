import Members from "@/components/members/Members";
import { OPTIONS } from "@/util/authOptions";
import { UserRole } from "@prisma/client";
import { getServerSession } from "next-auth";
import { redirect } from "next/navigation";

export default async function MembersPage() {
  const session = await getServerSession(OPTIONS);
  if (!session?.user?.id || session?.user?.role === UserRole.Member) {
    redirect("/gammoda/admin/login");
  }
  return <Members />;
}
