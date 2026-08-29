import React from "react";
import { Member, MembershipLevel } from "@prisma/client";
import { calculateAge } from "@/util/date";

export const TEMPLATE_BY_LEVEL: Record<MembershipLevel, string> = {
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
//
// Each box is defined by its top-left corner, width and height, and the
// text is vertically (and for renewedYear, horizontally) centered inside it
// via flexbox — NOT a `transform: translate(...)`. html2canvas (used for
// the "download ID" export) handles flexbox centering reliably but has
// historically misplaced elements positioned with a translate transform,
// which showed up as the exported PNG's text sitting visibly below where
// it appears on screen.
const FIELD_BOX = {
  idNo: { left: "85%", top: "5.05%", width: "13.5%", height: "4.8%" },
  fullName: { left: "42.5%", top: "30.1%", width: "50%", height: "4.8%" },
  age: { left: "42.5%", top: "38.3%", width: "13%", height: "4.8%" },
  sex: { left: "57.8%", top: "38.3%", width: "20%", height: "4.8%" },
  occupation: { left: "42.5%", top: "46.4%", width: "50%", height: "4.8%" },
  nationality: { left: "42.5%", top: "54.8%", width: "50%", height: "4.8%" },
  address: { left: "42.5%", top: "63.1%", width: "50%", height: "4.8%" },
  phone: { left: "42.5%", top: "71.3%", width: "50%", height: "4.8%" },
  renewedYear: { left: "6.9%", top: "77.8%", width: "6%", height: "4.8%" },
} as const;

const Field = ({
  box,
  fontSize,
  center,
  children,
}: {
  box: (typeof FIELD_BOX)[keyof typeof FIELD_BOX];
  fontSize: number;
  center?: boolean;
  children: React.ReactNode;
}) => (
  <div
    className="absolute flex items-center font-bold"
    style={{
      ...box,
      fontSize,
      justifyContent: center ? "center" : "flex-start",
    }}
  >
    {children}
  </div>
);

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
      <Field box={FIELD_BOX.idNo} fontSize={13}>
        {member?.memberId}
      </Field>
      <Field box={FIELD_BOX.fullName} fontSize={15}>
        {fullName}
      </Field>
      <Field box={FIELD_BOX.age} fontSize={13}>
        {member?.dateOfBirth ? calculateAge(member.dateOfBirth) : "-"}
      </Field>
      <Field box={FIELD_BOX.sex} fontSize={13}>
        {member?.gender ?? "-"}
      </Field>
      <Field box={FIELD_BOX.occupation} fontSize={13}>
        {member?.expertise?.slice(0, 25) ?? "-"}
        {member?.expertise && member.expertise.length > 25 && "..."}
      </Field>
      <Field box={FIELD_BOX.nationality} fontSize={13}>
        {member?.nationality ?? "-"}
      </Field>
      <Field box={FIELD_BOX.address} fontSize={13}>
        {member?.city ?? "-"}
      </Field>
      <Field box={FIELD_BOX.phone} fontSize={13}>
        {member?.phone}
      </Field>
      <Field box={FIELD_BOX.renewedYear} fontSize={10} center>
        {member?.idRenewedYear ?? "-"}
      </Field>
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
