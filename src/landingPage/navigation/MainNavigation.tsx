"use client";

import StyledMenu from "@/components/shared/StyledMenu";
import {
  ArrowDropDown,
  Close,
  Facebook,
  Instagram,
  Menu,
  Telegram,
  Twitter,
} from "@mui/icons-material";
import { Avatar, Button, IconButton, MenuItem } from "@mui/material";
import { UserRole } from "@prisma/client";
import { useSession } from "next-auth/react";
import { usePathname, useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import ProfileMenu from "./ProfileMenu";
import Link from "next/link";
import DonationForm from "../modals/DonationForm";
import { useTranslation } from "react-i18next";
import useLanguageStore from "@/redux/languageStore";

export default function MainNaviagtion({ bg }: { bg?: string }) {
  const router = useRouter();
  const session = useSession();
  const hasValidSession = Boolean(
    session.data?.user.id && session.data.user.role === UserRole.Member
  );
  const pathname = usePathname();
  const isHome = Boolean(pathname === "/");
  const [menuOpen, setMenuOpen] = useState(false);
  const [openDonateModal, setOpenDonateModal] = useState(false);
  const [anchorEl, setAnchorEl] = useState<null | Element>(null);
  const open = Boolean(anchorEl);
  const { i18n, t } = useTranslation();
  const { language, setLanguage } = useLanguageStore();

  useEffect(() => {
    i18n.changeLanguage(language);
  }, [language, i18n]);

  const handleChangeLanguage = (newLanguage: any) => {
    setLanguage(newLanguage);
  };

  const menuItems = [
    { name: "Home", link: "/" },
    { name: "About", link: "/about" },
    { name: "News", link: "/news" },
    { name: "Resources", link: "/resources" },
  ];

  return (
    <div className={`${bg}`}>
      <StyledMenu
        anchorEl={anchorEl}
        open={open}
        onClose={() => setAnchorEl(null)}
      >
        <div>
          <MenuItem onClick={() => router.push("/auctions")}>
            <div className="flex flex-row items-center gap-2 px-2">
              <span>Auctions</span>
            </div>
          </MenuItem>
          <MenuItem onClick={() => router.push("/vacancies")}>
            <div className="flex flex-row items-center gap-2 px-2">
              <span>Vacancy</span>
            </div>
          </MenuItem>
        </div>
      </StyledMenu>
      <DonationForm
        open={openDonateModal}
        handleClose={() => setOpenDonateModal(false)}
      />
      <div className="z-50 relative flex w-full flex-row items-center justify-between xl:lg:px-40 md:px-20 px-10 xl:lg:h-[140px] pt-8 md:h-[140px] h-[100px] bg-transparent overflow-hidden">
        <div
          className={` flex-1 w-full xl:lg:pr-80 md:pr-40  absolute top-[15px] hidden xl:lg:md:flex flex-row justify-end  gap-8 ${
            isHome ? "text-white" : "text-black"
          }`}
        >
          <div className="flex flex-row items-center text-sm justify-center gap-4">
            <span>Join our social media:</span>
            <Link target="_blank" href={"https://t.me/gammoda"}>
              <Telegram />
            </Link>
            {/* <Twitter /> */}
            <Link
              target="_blank"
              href="https://www.facebook.com/gamodevelopmentassociation?mibextid=ZbWKwL"
            >
              <Facebook />
            </Link>
            {/* <Instagram /> */}
          </div>
          <span
            onClick={() => setOpenDonateModal(true)}
            className="hover:text-primaryColor cursor-pointer text-sm"
          >
            Donate
          </span>
          <span
            onClick={() => router.push("/#contact-us")}
            className="hover:text-primaryColor cursor-pointer text-sm"
          >
            Contact
          </span>
          <span
            onClick={() => router.push("/#faqs")}
            className="hover:text-primaryColor cursor-pointer text-sm"
          >
            FAQ
          </span>
          <select
            value={i18n.language}
            onChange={(e) => {
              handleChangeLanguage(e.target.value);
            }}
            className={`bg-transparent outline-none border-none px-1 hover:cursor-pointer text-sm -mt-1`}
          >
            <option value={"en"} className="text-black">
              English
            </option>
            <option value={"am"} className="text-black">
              አማርኛ
            </option>
          </select>
        </div>
        <div
          onClick={() => router.push("/")}
          className="text-primaryColor font-bold relative flex flex-row items-center justify-evenly cursor-pointer"
        >
          <Avatar
            src={"/images/whitBgLogo.svg"}
            alt=""
            className="h-[60px] w-[60px]"
            style={{
              boxShadow: "2px 3px 12px rgb(0,0,0,0.2)",
            }}
          />
        </div>
        <div className=" font-bold xl:lg:md:relative hidden xl:lg:md:flex flex-row items-center h-full gap-10">
          {menuItems.map((item, index) => {
            const isActive = Boolean(item.link === pathname);
            return (
              <span
                onClick={() => router.push(item.link)}
                key={index}
                className={`cursor-pointer  
                      ${
                        isActive
                          ? " text-primaryColor"
                          : isHome
                          ? "text-white"
                          : "text-black"
                      } border-b-2 border-b-transparent
                     hover:border-b-2 hover:border-primaryColor py-2 px-2`}
              >
                {item.name}
              </span>
            );
          })}
          <div className="min-w-[130px]">
            <div
              className={`w-full  h-full p-2 relative pr-8 ${
                isHome && "text-white"
              } text-center cursor-pointer rounded-[5px]`}
              onClick={(e) => setAnchorEl(e.currentTarget)}
            >
              Opportunity
              <ArrowDropDown className="absolute right-2 top-2" />
            </div>
          </div>
        </div>
        <div className="hidden xl:lg:md:block">
          {hasValidSession ? (
            <ProfileMenu />
          ) : (
            <Button
              variant="outlined"
              onClick={() => router.push("/login")}
              className="text-white capitalize bg-primaryColor hover:text-primaryColor shadow-none px-6 py-2 rounded-[5px] cursor-pointer "
            >
              Join
            </Button>
          )}
        </div>
        <div
          className={`xl:lg:md:hidden absolute top-2 right-10 w-fit h-full flex flex-row items-center ${
            isHome && "text-white"
          } z-20 cursor-pointer `}
          onClick={() => setMenuOpen(!menuOpen)}
        >
          {menuOpen ? <Close /> : <Menu />}
        </div>
        {menuOpen && (
          <div
            onClick={() => setMenuOpen(!menuOpen)}
            className="xl:lg:md:hidden fixed w-screen h-screen top-0 left-0 bg-black z-10 opacity-5"
          />
        )}
        <div
          className={`xl:lg:md:hidden fixed bg-white h-screen overflow-y-auto top-0 left-0 w-screen px-10 pt-10 z-20 ${
            menuOpen ? "translate-x-[0] duration-300" : "translate-x-[-100%]"
          } hiddenscrollbar`}
        >
          <div className="text-black relative pb-20 font-bold flex flex-col items-start h-full gap-6 cursor-pointer">
            <div className="w-full flex flex-row items-center justify-end">
              <IconButton onClick={() => setMenuOpen(!menuOpen)}>
                <Close />
              </IconButton>
            </div>
            {menuItems.map((item, index) => {
              const isActive = Boolean(item.link === pathname);
              return (
                <div className="w-full" key={index}>
                  <span
                    onClick={() => {
                      router.push(item.link);
                      setMenuOpen(!menuOpen);
                    }}
                    key={index}
                    className={` w-fit cursor-pointer 
                      ${
                        isActive
                          ? "border-b-2 border-b-primaryColor"
                          : "border-b-2 border-b-transparent"
                      }
                     hover:border-b-2 hover:border-primaryColor py-2 px-2`}
                  >
                    {item.name}
                  </span>
                </div>
              );
            })}
            <div className="w-full">
              <span
                onClick={() => {
                  router.push("/auctions");
                  setMenuOpen(!menuOpen);
                }}
                className={` w-fit cursor-pointer 
                      ${
                        Boolean("auctions" === pathname)
                          ? "border-b-2 border-b-primaryColor"
                          : "border-b-2 border-b-transparent"
                      }
                     hover:border-b-2 hover:border-primaryColor py-2 px-2`}
              >
                Auctions
              </span>
            </div>
            <div className="w-full">
              <span
                onClick={() => {
                  router.push("/vacancies");
                  setMenuOpen(!menuOpen);
                }}
                className={` w-fit cursor-pointer 
                      ${
                        Boolean("vacancies" === pathname)
                          ? "border-b-2 border-b-primaryColor"
                          : "border-b-2 border-b-transparent"
                      }
                     hover:border-b-2 hover:border-primaryColor py-2 px-2`}
              >
                Vacancy
              </span>
            </div>
            <span
              onClick={() => {
                setOpenDonateModal(true);
                setMenuOpen(!menuOpen);
              }}
              className={`w-fit cursor-pointer hover:border-b-2 hover:border-primaryColor px-2`}
            >
              Donate
            </span>
            {hasValidSession ? (
              <ProfileMenu />
            ) : (
              <Button
                variant="outlined"
                onClick={() => {
                  router.push("/login");
                  setMenuOpen(!menuOpen);
                }}
                className=" text-white capitalize bg-primaryColor hover:text-primaryColor shadow-none px-6 py-2 rounded-[5px] cursor-pointer "
              >
                Join
              </Button>
            )}
            <span className="flex flex-col font-normal gap-1 mt-2">
              <span className="text-xs">Language</span>
              <select
                value={i18n.language}
                className={`${
                  isHome && "bg-transparent"
                } outline-none border-none px-1 hover:cursor-pointer`}
                onChange={(e) => {
                  handleChangeLanguage(e.target.value);
                }}
              >
                <option value={"en"} className="text-black">
                  English
                </option>
                <option value={"am"} className="text-black">
                  አማርኛ
                </option>
              </select>
            </span>
            <span className="flex flex-col font-normal gap-1 mt-2">
              <span className="text-xs">Join our social media</span>
              <span className="flex flex-row gap-2 text-[#474747]">
                <Link target="_blank" href={"https://t.me/gammoda"}>
                  <Telegram />
                </Link>
                {/* <Twitter /> */}
                <Link
                  target="_blank"
                  href="https://www.facebook.com/gamodevelopmentassociation?mibextid=ZbWKwL"
                >
                  <Facebook />
                </Link>
                {/* <Instagram /> */}
              </span>
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}
