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
      className="absolute flex flex-col pt-1/3 items-center justify-center min-w-[800px] max-w-fit px-8 py-4 bg-white border-2"
    >
      <div className="flex flex-col text-center w-full">
        <p className="text-sm">Gamo Development Association</p>
        <p className="text-xl font-black">Members ID Card</p>
      </div>
      <div className="flex flex-row items-center gap-6 justify-center w-fit">
        <div className="flex flex-col justify-center items-center gap-2 ">
          <div className="flex flex-row items-center justify-start gap-8 w-full">
            <div className="relative rounded-full w-[100px] h-[100px]">
              <Image
                fill
                className="rounded-full object-cover"
                src={member?.profileImage ?? ""}
                alt="Profile-photo"
                style={{ objectFit: "cover" }}
              />
              <Avatar
                src={getMembershipImage()}
                alt="badge"
                className="absolute -right-3 bottom-0 w-[30px] h-[30px]"
              />
            </div>
            <div className="text-center flex flex-col gap-2">
              <div className="flex flex-row items-center gap-4">
                <span className="text-sm font-light">Full Name</span>
                <span className=" font-black">{`${
                  member?.firstName
                    ? `${member?.firstName} ${member?.lastName}`
                    : `${member?.institutionName}`
                }`}</span>
              </div>
              <div className="flex flex-row items-center gap-4">
                <span className="text-sm font-light">ID Number: </span>
                <span className="font-black ">{`${member?.memberId}`}</span>
              </div>
            </div>
          </div>
          <div className="grid grid-cols-2 gap-2">
            <div className="flex flex-row items-center gap-2">
              <span className="font-light text-sm">Nationality: </span>
              <span className="font-black">Ethiopian</span>
            </div>
            <div className="flex flex-row items-center gap-2">
              <span className="font-light text-sm">Phone: </span>
              <span className="font-black">{member?.phone}</span>
            </div>
            <div className="flex flex-row items-center gap-2">
              <span className="font-light text-sm">Sex: </span>
              <span className="font-black">{member?.gender ?? "-"}</span>
            </div>
            <div className="flex flex-row items-center gap-2">
              <span className="font-light text-sm">Age: </span>
              <span className="font-black">{member?.dateOfBirth ?? "-"}</span>
            </div>
            <div className="flex flex-row items-center gap-2">
              <span className="font-light text-sm">Occupation: </span>
              <span className="font-black">{member?.fieldOfWork ?? "-"}</span>
            </div>
            <div className="flex flex-row items-center gap-2">
              <span className="font-light text-sm">Address: </span>
              <span className="font-black">{member?.city ?? "-"}</span>
            </div>
          </div>
        </div>

        {/* container in the right */}
        <div className="flex flex-col items-center gap-2">
          <Avatar src={getMembershipImage()} className="w-[80px] h-[80px]" />
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
