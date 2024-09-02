import React from "react";
import Image from "next/image";
import { Member, MembershipLevel } from "@prisma/client";
import { Avatar } from "@mui/material";
import { calculateAge } from "@/util/date";

const GammodaId = ({
  gammodaIdRef,
  member,
}: {
  gammodaIdRef?: any;
  member: Member;
}) => {
  const getMembershipImage = (membershipLevel: MembershipLevel) => {
    switch (membershipLevel) {
      case "Gold":
        return (
          <div
            ref={gammodaIdRef}
            className={`absolute w-[800px] h-[494px]`}
            style={{
              background: `url("/badges/goldID.png")`,
              backgroundSize: "contain",
              backgroundPosition: "center",
            }}
          >
            <div className="relative w-full h-full">
              <span className="absolute top-[106px] left-[655px] font-black text-sm">{`${member?.memberId}`}</span>
              <span className="absolute top-[146px] left-[363px] font-black">{`${
                member?.firstName
                  ? `${member?.firstName} ${member?.lastName}`
                  : `${member?.institutionName}`
              }`}</span>
              <span className="absolute top-[195px] left-[335px] font-black text-sm">
                {member?.dateOfBirth ? calculateAge(member?.dateOfBirth) : "-"}
              </span>
              <span className="absolute top-[195px] left-[468px] font-black text-sm">
                {member?.gender ?? "-"}
              </span>
              <span className="absolute top-[240px] left-[330px] font-black text-sm text-ellipsis">
                {member?.expertise?.slice(0, 25) ?? "-"}
                {member?.expertise && member?.expertise?.length > 25 && "..."}
              </span>
              <span className="absolute top-[285px] left-[340px] font-black">
                {member?.nationality ?? "-"}
              </span>
              <span className="absolute top-[328px] left-[345px] font-black text-sm">
                {member?.city ?? "-"}
              </span>
              <span className="absolute top-[363px] left-[345px] font-black text-sm">
                {member?.phone}
              </span>
              <div
                style={{
                  backgroundImage: `url('${getProfileImage()}')`,
                  backgroundPosition: "center",
                  backgroundSize: "cover",
                }}
                className="absolute top-[187px] right-[24px] h-[210px] w-[172px] rounded-xl"
              />
            </div>
          </div>
        );
      case "Bronze":
        return (
          <div
            ref={gammodaIdRef}
            className={`absolute w-[800px] h-[494px]`}
            style={{
              background: `url("/badges/bronzeID.png")`,
              backgroundSize: "contain",
              backgroundPosition: "center",
            }}
          >
            <div className="relative w-full h-full">
              <span className="absolute top-[106px] left-[645px] font-black text-sm">{`${member?.memberId}`}</span>
              <span className="absolute top-[140px] left-[353px] font-black">{`${
                member?.firstName
                  ? `${member?.firstName} ${member?.lastName}`
                  : `${member?.institutionName}`
              }`}</span>
              <span className="absolute top-[195px] left-[319px] font-black text-sm">
                {member?.dateOfBirth ? calculateAge(member?.dateOfBirth) : "-"}
              </span>
              <span className="absolute top-[195px] left-[423px] font-black text-sm">
                {member?.gender ?? "-"}
              </span>
              <span className="absolute top-[245px] left-[330px] font-black text-sm text-ellipsis">
                {member?.expertise?.slice(0, 25) ?? "-"}
                {member?.expertise && member?.expertise?.length > 25 && "..."}
              </span>
              <span className="absolute top-[287px] left-[320px] font-black">
                {member?.nationality ?? "-"}
              </span>
              <span className="absolute top-[333px] left-[325px] font-black text-sm">
                {member?.city ?? "-"}
              </span>
              <span className="absolute top-[370px] left-[325px] font-black text-sm">
                {member?.phone}
              </span>
              <div
                style={{
                  backgroundImage: `url('${getProfileImage()}')`,
                  backgroundPosition: "center",
                  backgroundSize: "cover",
                }}
                className="absolute top-[187px] right-[34px] h-[210px] w-[180px] rounded-xl"
              />
            </div>
          </div>
        );
      case "Diamond":
        return (
          <div
            ref={gammodaIdRef}
            className={`absolute w-[800px] h-[494px] text-white`}
            style={{
              background: `url("/badges/diamondID.png")`,
              backgroundSize: "contain",
              backgroundPosition: "center",
            }}
          >
            <div className="relative w-full h-full">
              <span className="absolute top-[100px] left-[640px] font-black text-sm">{`${member?.memberId}`}</span>
              <span className="absolute top-[130px] left-[353px] font-black">{`${
                member?.firstName
                  ? `${member?.firstName} ${member?.lastName}`
                  : `${member?.institutionName}`
              }`}</span>
              <span className="absolute top-[180px] left-[320px] font-black text-sm">
                {member?.dateOfBirth ? calculateAge(member?.dateOfBirth) : "-"}
              </span>
              <span className="absolute top-[180px] left-[390px] font-black text-sm">
                {member?.gender ?? "-"}
              </span>
              <span className="absolute top-[230px] left-[320px] font-black text-sm text-ellipsis">
                {member?.expertise?.slice(0, 25) ?? "-"}
                {member?.expertise && member?.expertise?.length > 25 && "..."}
              </span>
              <span className="absolute top-[270px] left-[320px] font-black">
                {member?.nationality ?? "-"}
              </span>
              <span className="absolute top-[318px] left-[325px] font-black text-sm">
                {member?.city ?? "-"}
              </span>
              <span className="absolute top-[365px] left-[325px] font-black text-sm">
                {member?.phone}
              </span>
              <div
                style={{
                  backgroundImage: `url('${getProfileImage()}')`,
                  backgroundPosition: "center",
                  backgroundSize: "cover",
                }}
                className="absolute top-[187px] right-[34px] h-[210px] w-[152px] rounded-xl"
              />
            </div>
          </div>
        );
      case "Platinum":
        return (
          <div
            ref={gammodaIdRef}
            className={`absolute w-[800px] h-[494px] text-white`}
            style={{
              background: `url("/badges/platinumID.png")`,
              backgroundSize: "contain",
              backgroundPosition: "center",
            }}
          >
            <div className="relative w-full h-full">
              <span className="absolute top-[98px] left-[640px] font-black text-sm">{`${member?.memberId}`}</span>
              <span className="absolute top-[130px] left-[358px] font-black">{`${
                member?.firstName
                  ? `${member?.firstName} ${member?.lastName}`
                  : `${member?.institutionName}`
              }`}</span>
              <span className="absolute top-[180px] left-[327px] font-black text-sm">
                {member?.dateOfBirth ? calculateAge(member?.dateOfBirth) : "-"}
              </span>
              <span className="absolute top-[180px] left-[390px] font-black text-sm">
                {member?.gender ?? "-"}
              </span>
              <span className="absolute top-[228px] left-[320px] font-black text-sm text-ellipsis">
                {member?.expertise?.slice(0, 25) ?? "-"}
                {member?.expertise && member?.expertise?.length > 25 && "..."}
              </span>
              <span className="absolute top-[268px] left-[320px] font-black">
                {member?.nationality ?? "-"}
              </span>
              <span className="absolute top-[318px] left-[325px] font-black text-sm">
                {member?.city ?? "-"}
              </span>
              <span className="absolute top-[365px] left-[325px] font-black text-sm">
                {member?.phone}
              </span>
              <div
                style={{
                  backgroundImage: `url('${getProfileImage()}')`,
                  backgroundPosition: "center",
                  backgroundSize: "cover",
                }}
                className="absolute top-[187px] right-[35px] h-[210px] w-[152px] rounded-xl"
              />
            </div>
          </div>
        );
      default:
        return (
          <div
            ref={gammodaIdRef}
            className={`absolute w-[800px] h-[494px]`}
            style={{
              background: `url("/badges/silverID.png")`,
              backgroundSize: "contain",
              backgroundPosition: "center",
            }}
          >
            <div className="relative w-full h-full">
              <span className="absolute top-[110px] left-[655px] font-black text-sm">{`${member?.memberId}`}</span>
              <span className="absolute top-[146px] left-[353px] font-black">{`${
                member?.firstName
                  ? `${member?.firstName} ${member?.lastName}`
                  : `${member?.institutionName}`
              }`}</span>
              <span className="absolute top-[190px] left-[317px] font-black text-sm">
                {member?.dateOfBirth ? calculateAge(member?.dateOfBirth) : "-"}
              </span>
              <span className="absolute top-[190px] left-[423px] font-black text-sm">
                {member?.gender ?? "-"}
              </span>
              <span className="absolute top-[230px] left-[320px] font-black text-sm text-ellipsis">
                {member?.expertise?.slice(0, 25) ?? "-"}
                {member?.expertise && member?.expertise?.length > 25 && "..."}
              </span>
              <span className="absolute top-[270px] left-[320px] font-black">
                {member?.nationality ?? "-"}
              </span>
              <span className="absolute top-[316px] left-[325px] font-black text-sm">
                {member?.city ?? "-"}
              </span>
              <span className="absolute top-[358px] left-[325px] font-black text-sm">
                {member?.phone}
              </span>
              <div
                style={{
                  backgroundImage: `url('${getProfileImage()}')`,
                  backgroundPosition: "center",
                  backgroundSize: "cover",
                }}
                className="absolute top-[187px] right-[24px] h-[210px] w-[172px] rounded-xl"
              />
            </div>
          </div>
        );
    }
  };

  const getProfileImage = (): string => {
    return member?.profileImage ?? "";
  };

  return getMembershipImage(member.membershipLevel);
};

export default GammodaId;
