import {
  checkMemberThreeMonth,
  getFormattedDate,
  getFormattedDateFromTimestamp,
} from "@/util/date";
import {
  Call,
  Close,
  EditNoteOutlined,
  InfoOutlined,
  LocationOnOutlined,
} from "@mui/icons-material";
import { Avatar, Button, CircularProgress, Drawer } from "@mui/material";
import { Contribution, Member, MembershipLevel } from "@prisma/client";
import axios from "axios";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import AddNewPaymentDrawer from "./AddNewPaymentDrawer";
import Image from "next/image";

interface MemberDetailProps {
  member: Member;
  open: boolean;
  onClose: () => void;
  onRefresh: () => void;
}

const MemberDetail = ({
  member,
  open,
  onClose,
  onRefresh,
}: MemberDetailProps) => {
  const router = useRouter();
  const [contributions, setContributions] = useState<Contribution[]>();
  const [loading, setLoading] = useState<boolean>();
  const [showAddPaymentModal, setShowAddPaymentModal] =
    useState<boolean>(false);

  const fetchMemberContributions = async (memberId: string) => {
    setLoading(true);
    const result = await axios.post("/api/contribution/fetch", {
      memberId,
    });

    if (result.data.success) {
      setContributions(result.data.value);
    }
    setLoading(false);
  };

  useEffect(() => {
    if (member?.id) {
      fetchMemberContributions(member.id);
    }
  }, [member]);
  
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
          <Avatar
            src={`${member?.profileImage}`}
            className="h-[100px] w-[100px] shadow-md"
          />
          <span className="text-3xl text-[#555555] font-bold  text-center">
            {member.firstName
              ? `${member.firstName} ${member.lastName}`
              : member.institutionName}
          </span>
          <span className="text-titleColor ">{member.memberId}</span>
          <span className="flex flex-row items-center justify-center gap-2">
            <span className="text-titleColor">Member Since: </span>
            <span>
              {getFormattedDateFromTimestamp(member.created_at.toString())}
            </span>
          </span>
        </div>
        <div className="flex flex-row w-full border-b-2 text-[#CFCFCF] my-6" />
        <div className="grid xl:grid-cols-3 lg:grid-cols-3 grid-cols-2 w-full items-center gap-6 px-2">
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
        <div className="grid xl:grid-cols-2 lg:grid-cols-2 md:grid-cols-2  w-full items-center gap-6 px-2">
          <div className="flex flex-row items-center gap-4">
            <span className="font-bold">Subscription: </span>
            <span
              className={`flex  flex-row items-center justify-center w-fit py-2 ${
                member.membershipLevel === MembershipLevel.Platinium
                  ? "bg-[#34A8A8] text-white"
                  : member.membershipLevel === MembershipLevel.Diamond
                  ? "bg-[#B0E0E62E] text-[#222222]"
                  : member.membershipLevel === MembershipLevel.Gold
                  ? "bg-[#FFD7002E]"
                  : member.membershipLevel === MembershipLevel.Siliver
                  ? "bg-[#C0C0C02E]"
                  : "bg-transparent"
              }  rounded-[8px] min-w-20 text-center px-4 h-8 `}
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
          <div className="grid xl:grid-cols-3 lg:grid-cols-3 md:grid-cols-2 items-center gap-4">
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
          <div className="grid xl:grid-cols-2 lg:grid-cols-2 md:grid-cols-2 items-center gap-4">
            {member.educationLevel && (
              <div className="flex flex-row items-center gap-2">
                <span className="text-titleColor text-sm">
                  Educational level:{" "}
                </span>
                <span className="font-bold text-[#555555] text-sm">{`${member.educationLevel}`}</span>
              </div>
            )}
            {member.dateOfBirth && (
              <div className="flex flex-row items-center gap-2 ">
                <span className="text-titleColor text-sm">Date of birth: </span>
                <span className="font-bold text-[#555555] text-sm">{`${member.dateOfBirth}`}</span>
              </div>
            )}
            <div className="flex flex-row items-center gap-2 ">
              <span className="text-titleColor text-sm">
                Work responsibility:{" "}
              </span>
              <span className="font-bold text-[#555555] text-sm">{`${member.positionAtWork}`}</span>
            </div>

            {member.positionAtWork && (
              <div className="flex flex-row items-center gap-2 ">
                <span className="text-titleColor text-sm">
                  Position at work:{" "}
                </span>
                <span className="font-bold text-[#555555] text-sm">{`${member.positionAtWork}`}</span>
              </div>
            )}
            {member.expertise && (
              <div className="flex flex-row items-center gap-2 ">
                <span className="text-titleColor text-sm">Expertise: </span>
                <span className="font-bold text-[#555555] text-sm">{`${member.expertise}`}</span>
              </div>
            )}
            {member.headOrRepresentative && (
              <div className="flex flex-row items-center gap-2 ">
                <span className="text-titleColor text-sm">
                  Head or Representative:{" "}
                </span>
                <span className="font-bold text-[#555555] text-sm">{`${member.headOrRepresentative}`}</span>
              </div>
            )}

            {member.branch && (
              <div className="flex flex-row items-center gap-2 ">
                <span className="text-titleColor text-sm">Branch: </span>
                <span className="font-bold text-[#555555] text-sm">{`${member.branch}`}</span>
              </div>
            )}
            {member.partnershipIdea && (
              <div className="flex flex-row items-center gap-2 ">
                <span className="text-titleColor text-sm">
                  Partnership idea:{" "}
                </span>
                <span className="font-bold text-[#555555] text-sm">{`${member.partnershipIdea}`}</span>
              </div>
            )}
            {member.fieldOfWork && (
              <div className="flex flex-row items-center gap-2 ">
                <span className="text-titleColor text-sm">Field of work: </span>
                <span className="font-bold text-[#555555] text-sm">{`${member.fieldOfWork}`}</span>
              </div>
            )}

            {member.lastPaidAt && (
              <div className="flex flex-row items-center gap-2 ">
                <span className="text-titleColor text-sm">Last paid at: </span>
                <span className="font-bold text-[#555555] text-sm">{`${getFormattedDate(
                  member.lastPaidAt
                )}`}</span>
              </div>
            )}
            <div className="flex flex-row items-center gap-2 ">
              <span className="text-titleColor text-sm">Payment Means: </span>
              <span className="font-bold text-[#555555] text-sm">{`${member.paymentMeans}`}</span>
            </div>
          </div>
        </div>
        <div className="flex flex-row w-full border-b-2 text-[#CFCFCF] my-6" />
        {member.nextDueDate && (
          <div className="flex flex-row items-center gap-2">
            <span className="text-titleColor text-sm font-bold">
              Next Payment Date:{" "}
            </span>
            <span className="font-bold text-[#555555] text-sm">{`${getFormattedDateFromTimestamp(
              member.nextDueDate.toString()
            )}`}</span>
          </div>
        )}

        <div className="flex flex-row items-center justify-between mt-10 w-full">
          <span className="font-bold text-2xl text-titleColor">
            Payment Record
          </span>
          <Button
            onClick={() => setShowAddPaymentModal(true)}
            variant="outlined"
            className="border-[1px] border-titleColor capitalize text-titleColor font-bold min-w-[140px]"
          >
            Add Payment
          </Button>
        </div>
        <div className="flex flex-row w-full border-b-2 text-[#CFCFCF] mt-6" />
        <div className="flex flex-col items-center w-full mt-4 pb-10">
          {!loading ? (
            contributions?.map((item: Contribution, index: number) => {
              return (
                <div
                  key={index}
                  className="w-full grid xl:grid-cols-4 lg:grid-cols-4 grid-cols-2 items-center px-10 shadow-md p-2 py-6 justify-around"
                >
                  <span className="font-bold capitalize min-w-[70px]">
                    {item.contributionSystem}
                  </span>
                  <span className="font-bold min-w-[100px] text-[14px]">
                    {item.amount} ETB
                  </span>
                  <small>
                    {getFormattedDateFromTimestamp(item.created_at.toString())}
                  </small>
                  <span className="bg-primaryColor text-white px-3 py-1 rounded-[22px] w-fit">
                    Paid
                  </span>
                </div>
              );
            })
          ) : (
            <CircularProgress />
          )}
        </div>
        <div className="flex flex-row items-center justify-between mt-6 w-full ">
          <span className="font-bold text-2xl text-titleColor">
            Generate Id
          </span>
        </div>
        <div className="flex flex-col mt-6 pb-6 w-full gap-6">
          {!checkMemberThreeMonth({
            createdAt: member.created_at,
            nextDueDate: member.nextDueDate,
          }) && (
            <div className="flex flex-row items-center justify-start border-[1px] border-[#F1CD89] bg-[#F6EDDA] p-4 gap-6 rounded-[5px]">
              <InfoOutlined className="text-[#F1CD89] h-[40px] w-[40px] rotate-180" />
              <span className="text-titleColor">
                This member has to pay at least <strong>three</strong> months be
                considered a real member so please consider paying your
                contributions to be eligible for IDs.
              </span>
            </div>
          )}
          <div className="relative flex flex-row p-2 h-[200px] w-full bg-[#EBEBEB] rounded-[5px]">
            <Button
              variant="outlined"
              className="absolute right-[15px] bottom-[15px] border-[#E0E0E0] text-[#7C7C7C] flex flex-row items-center capitalize gap-2 bg-white"
            >
              <Image
                src={"/icons/download.svg"}
                alt=""
                width={20}
                height={20}
              />
              Download
            </Button>
          </div>
        </div>
      </div>
      <AddNewPaymentDrawer
        member={member}
        open={showAddPaymentModal}
        onClose={() => setShowAddPaymentModal(false)}
        onRefresh={onRefresh}
      />
    </Drawer>
  );
};

export default MemberDetail;
