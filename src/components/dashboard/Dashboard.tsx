import Image from "next/image";
import PageHeader from "../shared/PageHeader";
import { MenuItem, Select } from "@mui/material";

const Dashboard = () => {
  const cardsData = [
    {
      name: "Members",
      icon: "/icons/cardsUser.svg",
      amount: "3200",
      increment: "+2.5%",
      increased: true,
    },
    {
      name: "Donation",
      icon: "/icons/cardsDonation.svg",
      amount: "35.1K ETB",
      increment: "10 people donated",
      increased: false,
    },
    {
      name: "Contribution",
      icon: "/icons/cardsContribution.svg",
      amount: "2700 ETB",
      increment: "+3.5%",
      increased: true,
    },
  ];

  return (
    <div className="w-full h-full flex flex-col">
      <PageHeader />
      <div className="w-full px-[40px] pt-10">
        <span className="text-titleColor font-bold text-3xl">Dashboard</span>
        <div className="grid xl:lg:grid-cols-3 md:grid-cols-2 gap-4 items-center pt-10">
          {cardsData.map((card, index) => {
            return (
              <div
                key={index}
                className="bg-white h-full rounded-[12px] p-4 flex flex-row items-center justify-between font-[300]"
              >
                <div className="flex flex-row items-center gap-6">
                  <Image src={card.icon} alt="" height={60} width={60} />
                  <div className="flex flex-col">
                    <span>{card.name}</span>
                    <span className="text-2xl font-bold">{card.amount}</span>
                    <span>
                      <span
                        className={`${card.increased && "text-primaryColor"}`}
                      >
                        {card.increment}{" "}
                      </span>
                      since last week
                    </span>
                  </div>
                </div>
                <span className="rotate-90 font-bold">...</span>
              </div>
            );
          })}
        </div>
        <div className="flex flex-row items-center justify-between gap-6 mt-10">
          <div className="border-b-[2px] flex-1 border-b-titleColor opacity-50" />
          <div className="w-[100px]">
            <Select defaultValue={"All time"} size="small">
              <MenuItem value="All time">All time</MenuItem>
              <MenuItem value="last 7 day">last 7 days</MenuItem>
              <MenuItem value="last month">last month</MenuItem>
            </Select>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
