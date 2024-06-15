import IndividualMember from "@/components/members/editMember/IndividualMember";
import InstitutionMember from "@/components/members/editMember/InstitutionMember";
import { findMemberById } from "@/db/member";
import { MembershipType } from "@prisma/client";

export default async function EditMembers({
  params,
}: {
  params: { id: string };
}) {
  const member = await findMemberById(params.id);
  if (member?.membershipType === MembershipType.Individual) {
    return <IndividualMember member={member} />;
  } else if (member?.membershipType === MembershipType.Company) {
    return <InstitutionMember member={member} />;
  } else return <></>;
}
