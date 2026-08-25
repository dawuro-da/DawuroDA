import IndividualMember from "@/components/members/editMember/IndividualMember";
import InstitutionMember from "@/components/members/editMember/InstitutionMember";
import { findMemberById } from "@/db/member";
import { OPTIONS } from "@/util/authOptions";
import { MembershipType, UserRole } from "@prisma/client";
import { getServerSession } from "next-auth";
import { redirect } from "next/navigation";

export default async function EditMembers({
  params,
}: {
  params: { id: string };
}) {
  const session = await getServerSession(OPTIONS);
  if (!session?.user || session?.user.role === UserRole.Member) {
    redirect("/daadmin/login");
  }

  const member = await findMemberById(params.id);

  if (
    session?.user?.role !== UserRole.Owner &&
    session?.user?.id !== member?.registeredBy
  ) {
    redirect("/admin/dashboard/members");
  }

  if (member?.membershipType === MembershipType.Individual) {
    return <IndividualMember member={member} />;
  } else if (member?.membershipType === MembershipType.Company) {
    return <InstitutionMember member={member} />;
  } else return <></>;
}
