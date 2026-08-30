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
export const FIELD_BOX = {
  idNo: { left: "83.7%", top: "4.8%", width: "11.1%", height: "3.6%" },
  fullName: { left: "42%", top: "30.11%", width: "27.35%", height: "3.6%" },
  age: { left: "42%", top: "38.29%", width: "8.75%", height: "3.6%" },
  sex: { left: "57.1%", top: "38.29%", width: "12.3%", height: "3.6%" },
  occupation: { left: "42%", top: "46.46%", width: "27.35%", height: "3.6%" },
  nationality: { left: "42%", top: "54.7%", width: "27.35%", height: "3.6%" },
  address: { left: "42%", top: "62.95%", width: "27.35%", height: "3.6%" },
  phone: { left: "42%", top: "71.2%", width: "27.35%", height: "3.6%" },
  renewedYear: { left: "5.45%", top: "78.0%", width: "5.55%", height: "3.28%" },
} as const;

// The Silver template's blank value-line boxes sit slightly lower in the
// artwork than the other 4 levels' — reusing the shared FIELD_BOX left the
// text sitting in the upper portion of each box with visible empty space
// below it. TEST_TOP_OFFSET below was tuned by rendering and comparing.
const SILVER_TOP_OFFSET = 1.15;
export const FIELD_BOX_SILVER = Object.fromEntries(
  Object.entries(FIELD_BOX).map(([key, box]) => [
    key,
    { ...box, top: `${parseFloat(box.top) + SILVER_TOP_OFFSET}%` },
  ])
) as typeof FIELD_BOX;

export const FONT_SIZE_PERCENT_OF_HEIGHT = 13 / 500;
export const PHOTO_BOX = { left: 4, top: 30.8, width: 17.35, height: 35.6 };
export const STAMP_BOX = {
  left: 13.85,
  top: 45,
  width: 15,
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

  const isSilver =
    member.membershipLevel === MembershipLevel.Silver ||
    member.membershipLevel === MembershipLevel.Standard;
  const box = isSilver ? FIELD_BOX_SILVER : FIELD_BOX;

  // All fields share one font size (previously fullName was larger and
  // renewedYear noticeably smaller than the rest — now every value reads
  // at the same size for a consistent look across the card).
  const FONT_SIZE = 13;

  return (
    <div
      className="relative w-[800px] aspect-[12278/7667] bg-cover bg-center bg-no-repeat text-[#1E1E1E]"
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
