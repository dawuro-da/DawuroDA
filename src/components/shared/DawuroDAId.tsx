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

// Field positions are percentages of the template image's own box. The
// templates were re-exported at 1768x1104 (same design, new file), so these
// were re-measured by sampling each template's actual pixel data for the
// light "blank line" boxes baked into the artwork — a vertical scan through
// the value column that alternates cleanly between box (low-variance,
// bright) and gap (background pattern) runs. All 5 level templates share
// pixel-identical box positions (verified against Bronze, Silver, and
// Platinum directly), so a single shared FIELD_BOX applies to every level —
// there is no longer a per-level offset.
//
// Each box is defined by its top-left corner, width and height, and the
// text is vertically (and for renewedYear, horizontally) centered inside it
// via flexbox — NOT a `transform: translate(...)`. html2canvas (used for
// the "download ID" export) handles flexbox centering reliably but has
// historically misplaced elements positioned with a translate transform,
// which showed up as the exported PNG's text sitting visibly below where
// it appears on screen.
export const FIELD_BOX = {
  idNo: { left: "84.3%", top: "5.0%", width: "11.2%", height: "4.5%" },
  fullName: { left: "41.5%", top: "32.2%", width: "27%", height: "4.2%" },
  age: { left: "41.5%", top: "40.3%", width: "8.9%", height: "4.2%" },
  sex: { left: "56.3%", top: "40.3%", width: "12.5%", height: "4.2%" },
  occupation: { left: "41.5%", top: "48.4%", width: "27%", height: "4.2%" },
  nationality: { left: "41.5%", top: "56.6%", width: "27%", height: "4.2%" },
  address: { left: "41.5%", top: "64.8%", width: "27%", height: "4.2%" },
  phone: { left: "41.5%", top: "72.9%", width: "27%", height: "4.2%" },
  renewedYear: { left: "5.4%", top: "80.0%", width: "6.6%", height: "3.3%" },
} as const;

export const FONT_SIZE_PERCENT_OF_HEIGHT = 13 / 500;
export const PHOTO_BOX = { left: 4.3, top: 30.9, width: 17.25, height: 35.2 };
export const STAMP_BOX = {
  left: 13.5,
  top: 46,
  width: 15.8,
  aspect: 530 / 505,
  rotateDeg: -8,
};
export const STAMP_SRC = "/images/dawuro-stamp-transparent.png";

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

const DawuroDAId = ({ member }: { member: Member }) => {
  const fullName = member?.firstName
    ? `${member.firstName} ${member.lastName}`
    : `${member?.institutionName}`;

  const box = FIELD_BOX;

  // All fields share one font size (previously fullName was larger and
  // renewedYear noticeably smaller than the rest — now every value reads
  // at the same size for a consistent look across the card).
  const FONT_SIZE = 13;

  return (
    <div
      className="relative w-[800px] aspect-[1768/1104] bg-cover bg-center bg-no-repeat text-[#1E1E1E]"
      style={{
        backgroundImage: `url("${TEMPLATE_BY_LEVEL[member.membershipLevel]}")`,
      }}
    >
      <Field box={box.idNo} fontSize={FONT_SIZE}>
        {member?.memberId}
      </Field>
      <Field box={box.fullName} fontSize={FONT_SIZE}>
        {fullName}
      </Field>
      <Field box={box.age} fontSize={FONT_SIZE}>
        {member?.dateOfBirth ? calculateAge(member.dateOfBirth) : "-"}
      </Field>
      <Field box={box.sex} fontSize={FONT_SIZE}>
        {member?.gender ?? "-"}
      </Field>
      <Field box={box.occupation} fontSize={FONT_SIZE}>
        {member?.expertise?.slice(0, 25) ?? "-"}
        {member?.expertise && member.expertise.length > 25 && "..."}
      </Field>
      <Field box={box.nationality} fontSize={FONT_SIZE}>
        {member?.nationality ?? "-"}
      </Field>
      <Field box={box.address} fontSize={FONT_SIZE}>
        {member?.city ?? "-"}
      </Field>
      <Field box={box.phone} fontSize={FONT_SIZE}>
        {member?.phone}
      </Field>
      <Field box={box.renewedYear} fontSize={FONT_SIZE} center>
        {member?.idRenewedYear ?? "-"}
      </Field>
      <div
        style={{
          backgroundImage: `url('${member?.profileImage ?? ""}')`,
          backgroundPosition: "center",
          backgroundSize: "cover",
          left: `${PHOTO_BOX.left}%`,
          top: `${PHOTO_BOX.top}%`,
          width: `${PHOTO_BOX.width}%`,
          height: `${PHOTO_BOX.height}%`,
        }}
        className="absolute rounded-xl"
      />
      {/* Straddles the photo's right edge and the field labels beside it,
          like an official stamp partly over a photo on a real ID. */}
      <img
        src={STAMP_SRC}
        alt=""
        className="absolute opacity-90 pointer-events-none"
        style={{
          left: `${STAMP_BOX.left}%`,
          top: `${STAMP_BOX.top}%`,
          width: `${STAMP_BOX.width}%`,
          aspectRatio: STAMP_BOX.aspect,
          transform: `rotate(${STAMP_BOX.rotateDeg}deg)`,
        }}
      />
    </div>
  );
};

export default DawuroDAId;
