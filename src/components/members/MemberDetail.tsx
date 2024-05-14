import {
  Call,
  Close,
  EditNoteOutlined,
  LocationCity,
  LocationCityOutlined,
  LocationOnOutlined,
} from "@mui/icons-material";
import { Avatar, Button, Drawer } from "@mui/material";
import { Member, MembershipLevel } from "@prisma/client";
import { useRouter } from "next/navigation";

interface MemberDetailProps {
  member: Member;
  open: boolean;
  onClose: () => void;
}
const MemberDetail = ({ member, open, onClose }: MemberDetailProps) => {
  const formattedDate = new Date(member?.created_at).toLocaleDateString(
    "en-US",
    {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
    }
  );

  const formattedTime = new Date(member?.created_at).toLocaleTimeString(
    "en-US",
    {
      hour: "2-digit",
      minute: "2-digit",
    }
  );

  const hour12 = formattedTime.slice(0, 2);

  const formattedTimestamp = formattedDate + " " + formattedTime;
  const router = useRouter();
  return (
    <Drawer anchor="right" open={open} onClose={onClose}>
      <div className="h-full xl:w-[700px] lg:w-[700px] md:w-[500px] w-screen p-8 flex flex-col items-center">
        <div className="flex flex-row justify-between items-center w-full">
          <div
            onClick={() => router.push(`/admin/dashboard/members/${member.id}`)}
            className="flex flex-row justify-center gap-2 items-center text-titleColor cursor-pointer"
          >
            <EditNoteOutlined />
            <span>Edit</span>
          </div>
          <Close onClick={onClose} className="cursor-pointer" />
        </div>
        <div className="mt-6 flex flex-col items-center gap-2">
          <Avatar className="h-[100px] w-[100px]" />
          <span className="text-3xl text-[#555555] font-bold ">
            {member.firstName
              ? `${member.firstName} ${member.lastName}`
              : member.institutionName}
          </span>
          <span className="text-titleColor ">{member.memberId}</span>
          <span className="flex flex-row items-center justify-center gap-2">
            <span className="text-titleColor">Member Since: </span>
            <span>{formattedTimestamp}</span>
          </span>
        </div>
        <div className="flex flex-row w-full border-b-2 text-[#CFCFCF] my-6" />
        <div className="flex flex-row w-full items-center gap-6 px-2">
          <div className="flex flex-row items-center gap-2">
            <LocationOnOutlined className="text-titleColor" />
            <div className="flex flex-col  ">
              <small>Address</small>
              <small>{`${member.zone}, ${member.city}`}</small>
            </div>
          </div>
          <div className="flex flex-row items-center gap-2">
            <Call className="text-titleColor" />
            <div className="flex flex-col justify-center ">
              <small>Phone Number</small>
              <small>{member.phone}</small>
            </div>
          </div>
          {member.gender && (
            <div className="flex flex-row items-center gap-2">
              <span className="text-[#555555]">Gender:</span>
              <span className="text-titleColor">{member.gender}</span>
            </div>
          )}
        </div>
        <div className="flex flex-row w-full border-b-2 text-[#CFCFCF] my-6" />
        <div className="flex flex-row w-full items-center gap-6 px-2">
          <div className="flex flex-row items-center gap-4">
            <span className="font-bold">Subscription: </span>
            <span
              className={`flex text-black flex-row items-center justify-center w-fit py-2 ${
                member.membershipLevel === MembershipLevel.Platinium
                  ? "bg-[#34A8A8]"
                  : member.membershipLevel === MembershipLevel.Diamond
                  ? "bg-[#B0E0E62E]"
                  : member.membershipLevel === MembershipLevel.Gold
                  ? "bg-[#FFD7002E]"
                  : member.membershipLevel === MembershipLevel.Siliver
                  ? "bg-[#C0C0C02E]"
                  : "bg-transparent"
              } text-white rounded-[8px] min-w-20 text-center px-4 h-8 `}
            >
              {member.membershipLevel}
            </span>
          </div>
          <div className="flex flex-row items-center gap-4">
            <span className="font-bold">Contribution System: </span>
            <span
              className={`flex flex-row items-center justify-center w-fit py-2
                bg-[#34A8A8] text-white rounded-[8px] min-w-20 text-center px-4 h-8 `}
            >
              {member.contributionSystem}
            </span>
          </div>
        </div>
        <div className="flex flex-row w-full border-b-2 text-[#CFCFCF] my-6" />
        <div className="flex flex-col w-full gap-2 px-2">
          <small>Address: </small>
          <div className="flex flex-row items-center gap-4">
            <div className="flex flex-row items-center gap-2">
              <span className="text-titleColor text-sm">Region: </span>
              <span className="font-bold text-[#555555] text-sm">{`${member.region}`}</span>
            </div>
            <div className="flex flex-row items-center gap-2">
              <span className="text-titleColor text-sm">Zone: </span>
              <span className="font-bold text-[#555555] text-sm">{`${member.zone}`}</span>
            </div>
            <div className="flex flex-row items-center gap-2">
              <span className="text-titleColor text-sm">Kebele: </span>
              <span className="font-bold text-[#555555] text-sm">{`${
                member.kebele ? member.kebele : "-"
              }`}</span>
            </div>
            <div className="flex flex-row items-center gap-2">
              <span className="text-titleColor text-sm">city: </span>
              <span className="font-bold text-[#555555] text-sm">{`${member.city}`}</span>
            </div>
          </div>
        </div>
        <div className="flex flex-row w-full border-b-2 text-[#CFCFCF] my-6" />
        <div className="flex flex-row w-full gap-2 px-2">
          <div className="flex flex-row items-center gap-4">
            {member.educationLevel && (
              <div className="flex flex-row items-center gap-2">
                <span className="text-titleColor text-sm">
                  Educational level:{" "}
                </span>
                <span className="font-bold text-[#555555] text-sm">{`${member.educationLevel}`}</span>
              </div>
            )}
            <div className="flex flex-row items-center gap-2">
              <span className="text-titleColor text-sm">
                Work responsibility:{" "}
              </span>
              <span className="font-bold text-[#555555] text-sm">{`${member.positionAtWork}`}</span>
            </div>
          </div>
        </div>
        <div className="flex flex-row w-full border-b-2 text-[#CFCFCF] my-6" />

        <div className="flex flex-row items-center justify-between mt-10 w-full">
          <span className="font-bold text-2xl text-titleColor">
            Payment Record
          </span>
          <Button
            variant="outlined"
            className="border-[1px] border-titleColor capitalize text-titleColor font-bold"
          >
            Add Payment
          </Button>
        </div>
        <div className="flex flex-row w-full border-b-2 text-[#CFCFCF] my-6" />
      </div>
    </Drawer>
  );
};

export default MemberDetail;
