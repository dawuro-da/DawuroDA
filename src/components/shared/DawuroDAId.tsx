import React from "react";
import { Member, MembershipLevel } from "@prisma/client";
import { calculateAge } from "@/util/date";

const TEMPLATE_BY_LEVEL: Record<MembershipLevel, string> = {
  Platinum: "/IDs/dawuroPlatinumId.jpg",
  Diamond: "/IDs/dawuroDiamondId.jpg",
  Gold: "/IDs/dawuroGoldId.jpg",
  Silver: "/IDs/dawuroSilverId.jpg",
  Bronze: "/IDs/dawuroBronzeId.jpg",
  Standard: "/IDs/dawuroSilverId.jpg",
};

// Field positions are percentages of the template image's own box, measured
// once against the (identical across all 5 levels) template layout — so the
// same coordinates apply no matter which level's background is in use.
const FIELD_POSITION = {
  idNo: { left: "85%", top: "7.45%" },
  fullName: { left: "42.5%", top: "32.5%" },
  age: { left: "42.5%", top: "40.7%" },
  sex: { left: "57.8%", top: "40.7%" },
  occupation: { left: "42.5%", top: "48.8%" },
  nationality: { left: "42.5%", top: "57.2%" },
  address: { left: "42.5%", top: "65.5%" },
  phone: { left: "42.5%", top: "73.7%" },
  renewedYear: { left: "9.9%", top: "80.2%" },
} as const;

const DawuroDAId = ({
  dawurodaIdRef,
  member,
}: {
  dawurodaIdRef?: any;
  member: Member;
}) => {
  const fullName = member?.firstName
    ? `${member.firstName} ${member.lastName}`
    : `${member?.institutionName}`;

  return (
    <div
      ref={dawurodaIdRef}
      className="relative w-[800px] aspect-[12278/7667] bg-cover bg-center bg-no-repeat text-[#1E1E1E]"
      style={{
        backgroundImage: `url("${TEMPLATE_BY_LEVEL[member.membershipLevel]}")`,
      }}
    >
      <span
        className="absolute -translate-y-1/2 font-bold text-[13px]"
        style={FIELD_POSITION.idNo}
      >
        {member?.memberId}
      </span>
      <span
        className="absolute -translate-y-1/2 font-bold text-[15px]"
        style={FIELD_POSITION.fullName}
      >
        {fullName}
      </span>
      <span
        className="absolute -translate-y-1/2 font-bold text-[13px]"
        style={FIELD_POSITION.age}
      >
        {member?.dateOfBirth ? calculateAge(member.dateOfBirth) : "-"}
      </span>
      <span
        className="absolute -translate-y-1/2 font-bold text-[13px]"
        style={FIELD_POSITION.sex}
      >
        {member?.gender ?? "-"}
      </span>
      <span
        className="absolute -translate-y-1/2 font-bold text-[13px]"
        style={FIELD_POSITION.occupation}
      >
        {member?.expertise?.slice(0, 25) ?? "-"}
        {member?.expertise && member.expertise.length > 25 && "..."}
      </span>
      <span
        className="absolute -translate-y-1/2 font-bold text-[13px]"
        style={FIELD_POSITION.nationality}
      >
        {member?.nationality ?? "-"}
      </span>
      <span
        className="absolute -translate-y-1/2 font-bold text-[13px]"
        style={FIELD_POSITION.address}
      >
        {member?.city ?? "-"}
      </span>
      <span
        className="absolute -translate-y-1/2 font-bold text-[13px]"
        style={FIELD_POSITION.phone}
      >
        {member?.phone}
      </span>
      <span
        className="absolute -translate-x-1/2 -translate-y-1/2 font-bold text-[10px]"
        style={FIELD_POSITION.renewedYear}
      >
        {member?.idRenewedYear ?? "-"}
      </span>
      <div
        style={{
          backgroundImage: `url('${member?.profileImage ?? ""}')`,
          backgroundPosition: "center",
          backgroundSize: "cover",
        }}
        className="absolute left-[3.9%] top-[30.8%] h-[35.6%] w-[17.35%] rounded-xl"
      />
    </div>
  );
};

export default DawuroDAId;
