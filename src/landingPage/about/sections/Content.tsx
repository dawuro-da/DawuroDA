import Image from "next/image";
import { useRouter } from "next/navigation";
import { useTranslation } from "react-i18next";

interface ContentProps {
  content: string;
  setContent: (content: string) => void;
}

const Content = ({ content, setContent }: ContentProps) => {
  const router = useRouter();
  const { t } = useTranslation();
  const contentData: {
    [key: string]: {
      title: string;
      description: string;
      bgColor: string;
      borderColor: string;
    };
  } = {
    About: {
      title: t("about.about_heading"),
      description: t("about.about_heading_description"),
      bgColor: "bg-[#D2232C]",
      borderColor: "border-[#D2232C]",
    },
    "CEO Message": {
      title: t("about.CEO_message_heading"),
      description: t("about.CEO_message_heading_description"),
      bgColor: "bg-[#13A6D9]",
      borderColor: "border-[#13A6D9]",
    },
    "Mission, Vision, Goals": {
      title: t("about.vision_mission_values_heading"),
      description: t("about.vision_mission_values_heading_description"),
      bgColor: "bg-[#222222]",
      borderColor: "border-[#222222]",
    },
    "Board Members": {
      title: t("about.board_members_heading"),
      description: t("about.board_members_heading_description"),
      bgColor: "bg-[#F0DC35]",
      borderColor: "border-[#F0DC35]",
    },
    Management: {
      title: t("about.management_heading"),
      description: t("about.management_heading_description"),
      bgColor: "bg-teal-500",
      borderColor: "border-teal-500",
    },
  };
  const { title, description, bgColor } = contentData[content];

  return (
    <>
      <div className="relative lg:mt-[130px] mt-[100px] h-max">
        <div className="w-full xl:lg:h-[90%] md:h-[90%] h-[30%] min-h-[200px] xl:lg:min-h-[400px] md:min-h-[400px] bg-[url('/images/bgabout.svg')] bg-cover bg-no-repeat" />
        <div
          className={`absolute right-[10%] font-light md:-bottom-[30%] -bottom-16 ${bgColor} ${
            bgColor === "bg-[#F0DC35]" ? "text-[#1E1E1E]" : "text-white"
          } p-4 w-4/5 mx-auto lg:pl-20 md:pl-10 pl-4 lg:pr-48 md:pr-16 md:py-10 py-5 md:space-y-8 space-y-3`}
        >
          <p className="flex flex-row items-center text-sm gap-1 mb-8">
            <span
              className="hover:underline hover:cursor-pointer"
              onClick={() => router.push("/")}
            >
              Home
            </span>{" "}
            /{" "}
            {content === "About" ? (
              <span
                className="hover:underline hover:cursor-pointer"
                onClick={() => setContent(`${content}`)}
              >{`${content}`}</span>
            ) : (
              <span className="flex flex-row items-center gap-1">
                <span
                  onClick={() => setContent(`About`)}
                  className="hover:underline hover:cursor-pointer"
                >{`About`}</span>{" "}
                <span>{"/"}</span>
                <span
                  className="hover:underline hover:cursor-pointer"
                  onClick={() => setContent(`${content}`)}
                >
                  {content}
                </span>
              </span>
            )}
          </p>
          <span className="font-extrabold h-fit lg:text-6xl md:text-3xl text-xl">
            {title}
          </span>
          <p className="md:text-sm text-xs md:block hidden">{description}</p>
        </div>
      </div>
    </>
  );
};

export default Content;
