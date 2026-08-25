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
    <div className="w-full border-b border-gray-200">
      <ul className="w-full flex flex-row flex-wrap items-center gap-2 md:gap-6 overflow-x-auto">
        {menuItems.map((item) => (
          <li
            key={item.id}
            className={`cursor-pointer shrink-0 whitespace-nowrap font-medium text-sm md:text-base px-1 pb-4 border-b-4 transition-colors ${
              currentContent === item.id
                ? `${borderColor} text-[#1E1E1E]`
                : "border-transparent text-titleColor hover:text-[#1E1E1E]"
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
