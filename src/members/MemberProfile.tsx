import { Member, MembershipType } from "@prisma/client";
import IndividualMemberProfile from "./components/IndividualMemberProfile";
import InstitutionMemberProfile from "./components/InstitutionMemberProfile";
import Naviagtion from "@/landingPage/navigation/Navigation";

const MemberProfile = ({ member }: { member: Member }) => {
  return (
    <div>
      <Naviagtion bg="bg-white" />

      <div className="xl:lg:px-40 md:px-20 px-10 w-full">
        {member.membershipType === MembershipType.Individual ? (
          <IndividualMemberProfile member={member} />
        ) : (
          <InstitutionMemberProfile member={member} />
        )}
      </div>
    </div>
  );
};

export default MemberProfile;
