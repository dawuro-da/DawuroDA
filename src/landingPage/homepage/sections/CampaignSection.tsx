import { Button } from "@mui/material";
import Image from "next/image";

const CampaignSection = () => {
  const campaigns = [
    {
      icon: "/icons/supportIcon.svg",
      title: "Support Flood Victims",
      description:
        "Join Us in Providing Urgent Relief and Long-Term Support for Those Affected by the Flood",
    },
    {
      icon: "/icons/supportIcon.svg",
      title: "Empowering Gamo: Building a Brighter Future Together",
      description:
        "Join Us in Providing Urgent Relief and Long-Term Support for Those Affected by the Flood",
    },
    {
      icon: "/icons/supportIcon.svg",
      title: "Support Flood Victims",
      description:
        "Join Us in Providing Urgent Relief and Long-Term Support for Those Affected by the Flood",
    },
  ];

  return (
    <div className="xl:lg:px-40 md:px-20 px-10 w-full py-12 mt-20 mb-20">
      <div className="grid xl:lg:grid-cols-2 gap-6">
        <div className="w-full h-full flex flex-col justify-center gap-6">
          <span className="tracking-tighter text-3xl font-bold max-w-[400px]">
            Join the Campaign: Support Those in Need, Rebuild Lives
          </span>
          <span className="max-w-[400px]">
            Together, We Can Provide Urgent Relief and Restore Hope to
            Communities in Crisis
          </span>
        </div>
        <div className="grid lg:grid-cols-2 md:grid-cols-3 gap-6">
          {campaigns.map((campaign) => {
            return (
              <div className="flex flex-col justify-center p-6 shadow-xl max-w-[300px] gap-4">
                <Image src={campaign.icon} alt="" height={40} width={40} />
                <span className="font-bold text-xl">{campaign.title}</span>
                <span className="font-light">{campaign.description}</span>
                <Button
                  variant="outlined"
                  className="bg-[#13A6D9] border-none hover:border-none hover:bg-[#13A6D9] text-white font-normal capitalize px-10 py-2 w-fit"
                >
                  Support
                </Button>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default CampaignSection;
