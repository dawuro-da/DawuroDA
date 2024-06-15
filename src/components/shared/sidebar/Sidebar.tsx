"use client";
import { Menu } from "@mui/icons-material";
import Image from "next/image";
import { usePathname, useRouter } from "next/navigation";
import { useState } from "react";

type MenuItemProps = {
  name: string;
  link: string;
  activeIcon: string;
  icon: string;
  isAccessible: boolean;
};

const Sidebar = (props: any) => {
  const router = useRouter();
  const path = usePathname();
  const [menuOpen, setMenuOpen] = useState(false);

  return (
    <>
      {menuOpen && (
        <div
          className="bg-black w-screen h-screen xl:lg:md:hidden absolute z-20 opacity-5"
          onClick={() => setMenuOpen(!menuOpen)}
        />
      )}
      <div
        className="xl:lg:md:hidden absolute z-20 top-0 left-0 bg-primaryColor text-white p-2 rounded-br-[16px]"
        onClick={() => setMenuOpen(!menuOpen)}
      >
        <Menu />
      </div>
      <div
        className={` ${
          menuOpen ? "translate-x-[0]" : "translate-x-[-100%]"
        } bg-primaryColor w-[300px] h-screen xl:lg:md:relative absolute z-20 xl:lg:md:translate-x-[0]`}
      >
        <div className="w-full h-full flex flex-col items-center p-6 pl-0 pt-0 relative">
          <div
            onClick={() => router.push("/admin/dashboard")}
            className="pl-6 flex flex-col items-center justify-center gap-2 w-full mb-2 select-none cursor-pointer"
          >
            <Image
              src={"/icons/logo.svg"}
              priority
              alt="logo"
              height={100}
              width={160}
              style={{ width: "100%" }}
              draggable={false}
            />
            <div className="border-b-[1px] border-b-[#A7DEB8] w-full" />
          </div>

          {props.menuItems.map((menu: MenuItemProps) => {
            const isActive =
              menu.name === props.menuItems[0].name //this check is necessary since the dashboard menu link is in all menu link
                ? Boolean(path === menu.link)
                : Boolean(path.includes(menu.link));

            return (
              menu.isAccessible && (
                <div
                  key={menu.name}
                  onClick={() => {
                    router.push(menu.link);
                    setMenuOpen(false);
                  }}
                  className={`flex flex-row items-center gap-6 w-full cursor-pointer text-[#A7DEB8]
                         py-3 px-6 mt-2 hover:text-white 
                        hover:bg-[rgb(255,255,255,0.2)]
                          ${
                            isActive
                              ? "bg-[rgb(255,255,255,0.2)] text-[white] border-l-8 border-l-[#fff]"
                              : "text-[#A7DEB8] border-l-8 border-l-primaryColor"
                          }`}
                >
                  <Image
                    src={isActive ? menu.activeIcon : menu.icon}
                    height={22}
                    width={22}
                    alt="logo"
                  />
                  <span className={`font-normal text-[16px] capitalize`}>
                    {menu.name}
                  </span>
                </div>
              )
            );
          })}

          <div className="absolute bottom-6 w-full left-0">
            <div
              onClick={() => {
                router.push("/admin/setting");
                setMenuOpen(false);
              }}
              className={`flex flex-row items-center gap-6 cursor-pointer mr-6
                        py-3 px-6 mt-4 hover:text-white
                        hover:bg-[rgb(255,255,255,0.4)] text-[#A7DEB8]
                       ${
                         Boolean(path.includes("/admin/setting"))
                           ? "bg-[rgb(255,255,255,0.4)] text-[white] border-l-8 border-l-[white]"
                           : "text-[#A7DEB8] border-l-8 border-l-primaryColor "
                       }
                          `}
            >
              <Image
                src={
                  Boolean(path.includes("/admin/setting"))
                    ? "/icons/settingsactive.svg"
                    : "/icons/settings.svg"
                }
                height={22}
                width={22}
                alt="logo"
              />
              <span className={`font-normal text-[16px] capitalize`}>
                Settings
              </span>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default Sidebar;
