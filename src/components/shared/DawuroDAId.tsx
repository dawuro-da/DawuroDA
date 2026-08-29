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

// Field positions are percentages of the template image's own box. Unlike
// the previous estimated values, these were measured by sampling the
// template's actual pixel data (public/IDs/dawuroBronzeId.jpg, 2000x1249)
// for the light "blank line" boxes baked into the artwork, so they line up
// exactly with the visible box rather than an eyeballed guess:
//   idNo:        x 1694-1916, y  68-113
//   fullName:    x  838-1385, y 384-428
//   age:         x  838-1012, y 487-531
//   sex:         x 1140-1385, y 487-531
//   occupation:  x  838-1385, y 589-635
//   nationality: x  838-1385, y 692-737
//   address:     x  838-1385, y 795-840
//   phone:       x  838-1385, y 898-943
//   renewedYear: x  107-218,  y 983-1024
// (identical across all 5 level templates — only the background/colors
// differ, the field layout does not.)
//
// Each box is defined by its top-left corner, width and height, and the
// text is vertically (and for renewedYear, horizontally) centered inside it
// via flexbox — NOT a `transform: translate(...)`. html2canvas (used for
// the "download ID" export) handles flexbox centering reliably but has
// historically misplaced elements positioned with a translate transform,
// which showed up as the exported PNG's text sitting visibly below where
// it appears on screen.
const FIELD_BOX = {
  idNo: { left: "84.7%", top: "5.44%", width: "11.1%", height: "3.6%" },
  fullName: { left: "41.9%", top: "30.74%", width: "27.35%", height: "3.6%" },
  age: { left: "41.9%", top: "38.99%", width: "8.75%", height: "3.6%" },
  sex: { left: "57%", top: "38.99%", width: "12.3%", height: "3.6%" },
  occupation: { left: "41.9%", top: "47.16%", width: "27.35%", height: "3.6%" },
  nationality: { left: "41.9%", top: "55.4%", width: "27.35%", height: "3.6%" },
  address: { left: "41.9%", top: "63.65%", width: "27.35%", height: "3.6%" },
  phone: { left: "41.9%", top: "71.9%", width: "27.35%", height: "3.6%" },
  renewedYear: { left: "5.35%", top: "78.7%", width: "5.55%", height: "3.28%" },
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
