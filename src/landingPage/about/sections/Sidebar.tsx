interface SidebarProps {
  setContent: (content: string) => void;
  currentContent: string;
  borderColor?: string
}

const Sidebar = ({ setContent, currentContent, borderColor }: SidebarProps) => {
  const menuItems = [
    "About",
    "What We Do",
    "President Message",
    "Mission, Vision, Goals",
    "Board Members",
    "Management",
  ];

  return (
    <div className="md:w-1/4 w-full flex flex-row justify-center">
      <ul className="w-full md:px-10 px-8">
        {menuItems.map((item) => (
          <li
            key={item}
            className={`cursor-pointer w-fit mb-4 font-[400] text-base ${
              currentContent === item ? `md:border-l-8 md:border-b-0 border-b-2 w-full md:pl-4 pl-0 ${borderColor}` : ""
            }`}
            onClick={() => setContent(item)}
          >
            {item}
          </li>
        ))}
      </ul>
    </div>
  );
};

export default Sidebar;
