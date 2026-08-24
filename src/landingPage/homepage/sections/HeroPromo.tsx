"use client";

import DonationForm from "@/landingPage/modals/DonationForm";
import { Insights, Login, VolunteerActivism } from "@mui/icons-material";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { useTranslation } from "react-i18next";

const HeroPromo = () => {
  const { t } = useTranslation();
  const router = useRouter();
  const [openDonateModal, setOpenDonateModal] = useState(false);

  const items = [
    {
      Icon: VolunteerActivism,
      heading: t("home.donate"),
      description: t("home.donate_subheading"),
      actionLabel: t("home.donate"),
      onClick: () => setOpenDonateModal(true),
    },
    {
      Icon: Login,
      heading: t("navigation.join"),
      description: t("home.slogan"),
      actionLabel: t("home.sign_in"),
      onClick: () => router.push("/login"),
    },
    {
      Icon: Insights,
      heading: t("navigation.initiatives"),
      description: t("home.development_initiatives_subheading"),
      actionLabel: t("home.learn_more"),
      onClick: () => router.push("/#initiatives"),
    },
  ];

  return (
    <div className="relative z-30 -mt-16 md:-mt-24">
      <DonationForm
        open={openDonateModal}
        handleClose={() => setOpenDonateModal(false)}
      />
      <div className="xl:lg:mx-40 md:mx-10 mx-4 bg-white rounded-2xl shadow-[0_16px_28px_rgba(0,0,0,0.15)] overflow-hidden">
        <div className="grid md:grid-cols-3 grid-cols-1">
          {items.map((item, index) => (
            <div
              key={index}
              onClick={item.onClick}
              className={`p-8 flex flex-col items-center text-center cursor-pointer transition-colors hover:bg-primaryColor/5 ${
                index !== items.length - 1
                  ? "md:border-r border-b md:border-b-0 border-dashed border-gray-200"
                  : ""
              }`}
            >
              <div className="h-16 w-16 rounded-full bg-primaryColor/10 flex items-center justify-center mb-4">
                <item.Icon className="text-primaryColor" fontSize="large" />
              </div>
              <h3 className="font-bold text-lg mb-2 capitalize">
                {item.heading}
              </h3>
              <p className="text-titleColor text-sm mb-4">
                {item.description}
              </p>
              <span className="text-primaryColor text-sm font-semibold hover:underline">
                {item.actionLabel}
              </span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default HeroPromo;
