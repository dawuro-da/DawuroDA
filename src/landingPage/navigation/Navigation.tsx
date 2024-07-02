"use client";

import {
  Close,
  Facebook,
  Instagram,
  Menu,
  Telegram,
  Twitter,
} from "@mui/icons-material";
import { Avatar, Button, IconButton } from "@mui/material";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useState } from "react";

export default function Navigation() {
  const [menuOpen, setMenuOpen] = useState(false);
  const router = useRouter();
  const pathname = usePathname();
  const isHome = Boolean(pathname === "/");
  const menuItems = [
    { name: "Home", link: "/" },
    { name: "About", link: "/about" },
    { name: "News", link: "/news" },
    { name: "Resources", link: "/resources" },
    { name: "Auctions", link: "/auctions" },
    { name: "Vacancy", link: "/jobs" },
  ];

  return (
    <div className="z-50 relative flex w-full flex-row items-center justify-between xl:lg:px-40 md:px-20 px-10 xl:lg:md:h-[180px] h-[100px]">
      <div
        className={`absolute top-[15px] flex-1 w-5/6 hidden xl:lg:md:flex flex-row justify-end gap-8 ${
          isHome ? "text-white" : "text-black"
        }`}
      >
        <div className="flex flex-row items-center text-sm justify-center gap-4">
          <span>Join our social media:</span>
          <Telegram />
          <Twitter />
          <Facebook />
          <Instagram />
        </div>
        <span className="hover:text-primaryColor cursor-pointer">Donate</span>
        <span className="hover:text-primaryColor cursor-pointer">Contact</span>
        <span className="hover:text-primaryColor cursor-pointer">FAQ</span>
        <select
          defaultValue={"en"}
          className={`${
            isHome && "bg-transparent"
          } outline-none border-none px-1 hover:cursor-pointer`}
        >
          <option value={"en"} className="text-black">
            English
          </option>
          <option value={"am"} className="text-black">
            Amharic
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
        />
      </div>
      <div className=" font-bold xl:lg:md:relative hidden xl:lg:md:flex flex-row items-center h-full gap-10">
        {menuItems.map((item, index) => {
          const isActive = Boolean(item.link === pathname);
          return (
            <Link
              href={item.link}
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
            </Link>
          );
        })}
      </div>
      <Button
        variant="outlined"
        onClick={() => router.push("/registration")}
        className="text-white capitalize bg-primaryColor shadow-none px-6 py-2 rounded-[5px] cursor-pointer hidden xl:lg:md:block"
      >
        Join
      </Button>
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
        className={`xl:lg:md:hidden fixed bg-white h-screen top-0 left-0 w-screen px-10 pt-10 z-20 ${
          menuOpen ? "translate-x-[0] duration-300" : "translate-x-[-100%]"
        }`}
      >
        <div
          onClick={() => router.push("/")}
          className="text-black relative font-bold flex flex-col items-start h-full gap-6 cursor-pointer"
        >
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
                  onClick={() => router.push(item.link)}
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
          <span
            onClick={() => router.push("/donate")}
            className={` w-full cursor-pointer 
                      ${
                        "/donate" === pathname
                          ? "border-b-2 border-b-primaryColor"
                          : "border-b-2 border-b-transparent"
                      }
                     hover:border-b-2 hover:border-primaryColor px-2`}
          >
            Donate
          </span>
          <Button
            variant="outlined"
            onClick={() => router.push("/registration")}
            className=" text-white capitalize bg-primaryColor shadow-none px-6 py-2 rounded-[5px] cursor-pointer "
          >
            Join
          </Button>
          <span className="flex flex-col font-normal gap-1 mt-2">
            <span className="text-xs">Language</span>
            <select
              defaultValue={"en"}
              className={`${
                isHome && "bg-transparent"
              } outline-none border-none px-1 hover:cursor-pointer`}
            >
              <option value={"en"} className="text-black">
                English
              </option>
              <option value={"am"} className="text-black">
                Amharic
              </option>
            </select>
          </span>
          <span className="flex flex-col font-normal gap-1 mt-2">
            <span className="text-xs">Join our social media</span>
            <span className="flex flex-row gap-2 text-[#474747]">
              <Telegram />
              <Twitter />
              <Facebook />
              <Instagram />
            </span>
          </span>
        </div>
      </div>
    </div>
  );
}
