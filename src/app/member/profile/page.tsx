import { findContributionsByContributorId } from "@/db/contribution";
import { findMemberById } from "@/db/member";
import MemberDashboard from "@/members/MemberDashboard";
import { OPTIONS } from "@/util/authOptions";
import { UserRole } from "@prisma/client";
import { getServerSession } from "next-auth";
import { redirect } from "next/navigation";

export default async function Page() {
  const session = await getServerSession(OPTIONS);
  if (!session?.user.id) {
    redirect("/login");
  }
  if (session.user.role !== UserRole.Member) {
    redirect("/gaadmin/login");
  }
  const member = await findMemberById(session?.user.id);
  const contributions = await findContributionsByContributorId({
    contributorId: session.user.id,
  });

  if (!member) {
    redirect("/login");
  }
  return <MemberDashboard member={member} contributions={contributions} />;
}
