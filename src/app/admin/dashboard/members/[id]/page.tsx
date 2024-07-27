import IndividualMember from "@/components/members/editMember/IndividualMember";
import InstitutionMember from "@/components/members/editMember/InstitutionMember";
import { findMemberById } from "@/db/member";
import { MembershipType, UserRole } from "@prisma/client";
import { getServerSession } from "next-auth";
import { redirect } from "next/navigation";

export default async function EditMembers({
  params,
}: {
  params: { id: string };
}) {
  const session = await getServerSession();
  if (!session?.user || session?.user.role === UserRole.Member) {
    redirect("/gaadmin/login");
  } else if (session?.user?.role === UserRole.Admin) {
    redirect("/admin/dashboard/members");
  }

  const member = await findMemberById(params.id);
  if (member?.membershipType === MembershipType.Individual) {
    return <IndividualMember member={member} />;
  } else if (member?.membershipType === MembershipType.Company) {
    return <InstitutionMember member={member} />;
  } else return <></>;
}
