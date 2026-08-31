"use client";

import StyledMenu from "@/components/shared/StyledMenu";
import {
  ArrowDropDown,
  Call,
  Close,
  Email,
  Facebook,
  Instagram,
  Menu,
  Telegram,
  Twitter,
  YouTube,
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
  const isAmharic = Boolean(i18n.language === "am");

  useEffect(() => {
    i18n.changeLanguage(language);
  }, [language, i18n]);

  const handleChangeLanguage = (newLanguage: any) => {
    setLanguage(newLanguage);
  };

  const menuItems = [
    { name: t("navigation.home"), link: "/" },
    { name: t("navigation.about"), link: "/about" },
    { name: t("navigation.news"), link: "/news" },
    { name: t("navigation.resources"), link: "/resources" },
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
              <span>{t("navigation.auctions")}</span>
            </div>
          </MenuItem>
          <MenuItem onClick={() => router.push("/vacancies")}>
            <div className="flex flex-row items-center gap-2 px-2">
              <span>{t("navigation.vacancy")}</span>
            </div>
          </MenuItem>
        </div>
      </StyledMenu>
      <DonationForm
        open={openDonateModal}
        handleClose={() => setOpenDonateModal(false)}
      />
      <div className="z-50 relative w-full bg-transparent overflow-hidden">
        {/* Top utility bar */}
        <div className="flex flex-row items-center justify-center md:justify-between xl:lg:px-40 md:px-20 px-4 h-9 md:h-11 text-xs md:text-sm bg-primaryColor text-white">
          <div className="flex flex-row items-center gap-3 md:gap-6">
            <Link
              href="mailto:info@dawuroda.org"
              className="flex flex-row items-center gap-1.5 md:gap-2 opacity-90 hover:opacity-100 transition-opacity"
            >
              <Email fontSize="small" />
              info@dawuroda.org
            </Link>
            <Link
              href="tel:251473450258"
              className="flex flex-row items-center gap-1.5 md:gap-2 opacity-90 hover:opacity-100 transition-opacity"
            >
              <Call fontSize="small" />
              +251 47 345 0258
            </Link>
          </div>
          <div className="hidden md:flex flex-row items-center gap-5">
            <span
              onClick={() => setOpenDonateModal(true)}
              className="opacity-90 hover:opacity-100 cursor-pointer transition-opacity"
            >
              {t("navigation.donate")}
            </span>
            <span
              onClick={() => router.push("/contact")}
              className="opacity-90 hover:opacity-100 cursor-pointer transition-opacity"
            >
              {t("navigation.contact")}
            </span>
            <span
              onClick={() => router.push("/#faqs")}
              className="opacity-90 hover:opacity-100 cursor-pointer transition-opacity"
            >
              {t("navigation.faq")}
            </span>
            <div className="flex flex-row items-center gap-3 border-l border-white/30 pl-5">
              <Link
                target="_blank"
                href="https://t.me/dawurodevelopmentassociation"
                className="opacity-90 hover:opacity-100 transition-opacity"
              >
                <Telegram fontSize="small" />
              </Link>
              <Link
                target="_blank"
                href="https://web.facebook.com/profile.php?id=61593361462376"
                className="opacity-90 hover:opacity-100 transition-opacity"
              >
                <Facebook fontSize="small" />
              </Link>
              <Link
                target="_blank"
                href="https://www.youtube.com/@DawuroDevelopmentAssociation"
                className="opacity-90 hover:opacity-100 transition-opacity"
              >
                <YouTube fontSize="small" />
              </Link>
            </div>
            <select
              value={i18n.language}
              onChange={(e) => {
                handleChangeLanguage(e.target.value);
              }}
              className={`bg-transparent text-white outline-none border-none px-1 hover:cursor-pointer`}
            >
              <option value={"en"} className="text-black">
                English
              </option>
              <option value={"am"} className="text-black">
                አማርኛ
              </option>
            </select>
          </div>
        </div>

        {/* Main bar */}
        <div className="flex w-full flex-row items-center justify-between xl:lg:px-40 md:px-20 px-10 xl:lg:h-[98px] md:h-[98px] h-[68px] bg-white">
          <div
            onClick={() => router.push("/")}
            className="font-bold relative flex flex-row items-center gap-3 cursor-pointer"
          >
            <Avatar
              src={"/images/dawuroda-logo-256.png"}
              alt="DawuroDA logo"
              className="h-[44px] w-[44px] md:h-[52px] md:w-[52px]"
              style={{
                boxShadow: "2px 3px 12px rgb(0,0,0,0.2)",
              }}
            />
            <div className="hidden md:flex flex-col leading-tight">
              <span className="text-primaryColor font-extrabold text-xl">
                {isAmharic
                  ? "የዳውሮ ልማት ማህበር"
                  : "Dawuro Development Association"}
              </span>
              <span className="text-titleColor text-xs font-normal">
                {t("footer.motto")}
              </span>
            </div>
          </div>
          <div className="font-bold xl:lg:md:relative hidden xl:lg:md:flex flex-row items-center h-full gap-8">
            {menuItems.map((item, index) => {
              const isActive = Boolean(item.link === pathname);
              return (
                <span
                  onClick={() => router.push(item.link)}
                  key={index}
                  className={`cursor-pointer
                      ${isActive ? " text-primaryColor" : "text-black"}
                      border-b-2 border-b-transparent
                     hover:border-b-2 hover:border-primaryColor py-2 px-2 transition-colors`}
                >
                  {item.name}
                </span>
              );
            })}
            <div className="min-w-[130px]">
              <div
                className="w-full h-full p-2 relative pr-8 text-black text-center cursor-pointer rounded-[5px]"
                onClick={(e) => setAnchorEl(e.currentTarget)}
              >
                {t("navigation.opportunities")}
                <ArrowDropDown className="absolute right-2 top-2" />
              </div>
            </div>
            {hasValidSession ? (
              <ProfileMenu />
            ) : (
              <Button
                variant="outlined"
                onClick={() => router.push("/login")}
                className="text-white capitalize bg-primaryColor border-2 border-primaryColor hover:border-2 hover:border-primaryColor hover:bg-white hover:text-primaryColor shadow-none px-6 py-2.5 rounded cursor-pointer transition-colors"
              >
                {t("navigation.join")}
              </Button>
            )}
          </div>
          <div
            className="xl:lg:md:hidden flex flex-row items-center text-black z-20 cursor-pointer"
            onClick={() => setMenuOpen(!menuOpen)}
          >
            {menuOpen ? <Close /> : <Menu />}
          </div>
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
                {t("navigation.auctions")}
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
                {t("navigation.vacancy")}
              </span>
            </div>
            <span
              onClick={() => {
                setOpenDonateModal(true);
                setMenuOpen(!menuOpen);
              }}
              className={`w-fit cursor-pointer hover:border-b-2 hover:border-primaryColor px-2`}
            >
              {t("navigation.donate")}
            </span>
            <span
              onClick={() => {
                router.push("/contact");
                setMenuOpen(!menuOpen);
              }}
              className={`w-fit cursor-pointer hover:border-b-2 hover:border-primaryColor px-2`}
            >
              {t("navigation.contact")}
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
                {t("navigation.join")}
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
              <span className="text-xs">{t("navigation.social_media")}</span>
              <span className="flex flex-row gap-2 text-[#474747]">
                <Link
                  target="_blank"
                  href="https://t.me/dawurodevelopmentassociation"
                >
                  <Telegram />
                </Link>
                {/* <Twitter /> */}
                <Link
                  target="_blank"
                  href="https://web.facebook.com/profile.php?id=61593361462376"
                >
                  <Facebook />
                </Link>
                <Link
                  target="_blank"
                  href="https://www.youtube.com/@DawuroDevelopmentAssociation"
                >
                  <YouTube />
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
