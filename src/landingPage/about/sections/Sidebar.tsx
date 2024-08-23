import { useTranslation } from "react-i18next";

interface SidebarProps {
  setContent: (content: string) => void;
  currentContent: string;
  borderColor?: string;
}

const Sidebar = ({ setContent, currentContent, borderColor }: SidebarProps) => {
  const { t } = useTranslation();
  const menuItems = [
    { id: "About", name: t("about.about_side_bar") },
    { id: "CEO Message", name: t("about.CEO_message_side_bar") },
    {
      id: "Mission, Vision, Goals",
      name: t("about.vision_mission_values_side_bar"),
    },
    { id: "Board Members", name: t("about.board_members_side_bar") },
    { id: "Management", name: t("about.management_side_bar") },
  ];

  return (
    <div className="md:w-1/4 w-full flex flex-row justify-center">
      <ul className="w-full md:px-10 px-8">
        {menuItems.map((item) => (
          <li
            key={item.id}
            className={`cursor-pointer w-fit mb-4 font-[400] text-base ${
              currentContent === item.id
                ? `md:border-l-8 md:border-b-0 border-b-2 w-full md:pl-4 pl-0 ${borderColor}`
                : ""
            }`}
            onClick={() => setContent(item.id)}
          >
            {item.name}
          </li>
        ))}
      </ul>
    </div>
  );
};

export default Sidebar;
