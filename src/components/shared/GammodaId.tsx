import React from "react";
import Image from "next/image";
import { Member } from "@prisma/client";
import { Avatar } from "@mui/material";

const GammodaId = ({
  gammodaIdRef,
  member,
}: {
  gammodaIdRef?: any;
  member: Member;
}) => {
  const getMembershipImage = () => {
    switch (member.membershipLevel) {
      case "Gold":
        return "/badges/gold-member.png";
      case "Bronze":
        return "/badges/bronze-member.png";
      case "Diamond":
        return "/badges/diamond-member.png";
      case "Platinium":
        return "/badges/platinium-member.png";
      case "Siliver":
        return "/badges/silver-member.png";
      default:
        return "";
    }
  };

  return (
    <div
      ref={gammodaIdRef}
      className={`absolute flex flex-col items-center 
          justify-center min-w-[800px]
          max-w-fit p-10 bg-white border-2 `}
      style={{
        background: "url('/images/gammoIdPattern.svg')",
      }}
    >
      <div className="flex flex-row items-center gap-6 justify-center w-fit">
        <div className="flex flex-col justify-center items-center gap-2 ">
          <div className="relative rounded-full w-[150px] h-[150px]">
            <Image
              fill
              className="rounded-full object-cover h-[150px] w-[150px]"
              src={member?.profileImage ?? ""}
              alt="Profile-photo"
            />
            <Avatar
              src={getMembershipImage()}
              alt="badge"
              className="absolute -right-3 bottom-0 w-[50px] h-[50px]"
            />
          </div>
          <div className="text-center flex flex-col gap-2">
            <div className="flex flex-col items-center">
              <span className="text-xs font-light">Full Name</span>
              <span className="font-black">{`${
                member?.firstName
                  ? `${member?.firstName} ${member?.lastName}`
                  : `${member?.institutionName}`
              }`}</span>
            </div>
          </div>
          <div className="grid grid-cols-2 gap-2 mt-6">
            <div className="flex flex-row items-center gap-2">
              <span className="text-xs font-light">ID Number: </span>
              <span className="font-black text-sm">{`${member?.memberId}`}</span>
            </div>
            <div className="flex flex-row items-center gap-2">
              <span className="font-light text-xs">Nationality: </span>
              <span className="font-black">Ethiopian</span>
            </div>
            <div className="flex flex-row items-center gap-2">
              <span className="font-light text-xs">Phone: </span>
              <span className="font-black text-sm">{member?.phone}</span>
            </div>
            <div className="flex flex-row items-center gap-2">
              <span className="font-light text-xs">Sex: </span>
              <span className="font-black text-sm">
                {member?.gender ?? "-"}
              </span>
            </div>
            <div className="flex flex-row items-center gap-2">
              <span className="font-light text-xs">Address: </span>
              <span className="font-black text-sm">{member?.city ?? "-"}</span>
            </div>
            <div className="flex flex-row items-center gap-2">
              <span className="font-light text-xs">Occupation: </span>
              <span className="font-black text-sm text-ellipsis">
                {member?.expertise?.slice(0, 25) ?? "-"}
                {member?.expertise && member?.expertise?.length > 25 && "..."}
              </span>
            </div>
          </div>
        </div>

        {/* container in the right */}
        <div className="flex flex-col items-center justify-center gap-2">
          <div className="flex flex-col text-center w-full">
            <p className="text-sm">Gamo Development Association</p>
            <p className="text-xl font-black">Members ID Card</p>
          </div>
          <div className="w-[150px] h-[120px]">
            <Image
              alt=""
              width={120}
              height={120}
              className="w-full"
              src={getMembershipImage()}
            />
          </div>
          <p className="text-center text-xs max-w-[300px]">
            We confirm that the person whose photograph sealed above is a member
            of Gamo Development Association.
          </p>
          <div className="flex gap-2">
            <Image
              src={"/images/logo.svg"}
              alt="badge"
              width={80}
              height={80}
              className="object-cover"
            />
            <div className="flex flex-col">
              <span className="font-bold">Contact</span>
              <span className="text-xs ml-4">- 0910324567</span>
              <span className="text-xs ml-4">- 0910600719</span>
              <span className="text-xs ml-4">- 0911283675</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default GammodaId;
