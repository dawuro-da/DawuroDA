import Image from "next/image";
import { useRouter } from "next/navigation";

interface ContentProps {
  content: string;
  setContent: (content: string) => void;
}

export const contentData: {
  [key: string]: {
    title: string;
    description: string;
    bgColor: string;
    borderColor: string;
  };
} = {
  About: {
    title: "Who we are?",
    description:
      "Gamo Development Association (GaDA), is an indigenous, not for profit, non-religious and development oriented non-governmental organization, which envisions to create prosperous society through bringing holistic and sustainable development building up on Gamo culture of peace and coexistence.",
    bgColor: "bg-[#D2232C]",
    borderColor: "border-[#D2232C]",
  },
  "CEO Message": {
    title: "CEO Message",
    description:
      "The reform of the association has focused on 7 thematic areas of education‚ health, clean drinking water‚ environmental protection and other infrastructure focus areas have been developed, and by investing a lot of resources in the sector, various sections of the society have been able to benefit.",
    bgColor: "bg-[#13A6D9]",
    borderColor: "border-[#13A6D9]",
  },
  "Mission, Vision, Goals": {
    title: "Mission, Vision, Goals",
    description:
      "GaDA is committed to ensure the involvement and benefit of all segments of the society from its development intervention disregard of disability status, religious, political, ethnic and any other background",
    bgColor: "bg-[#222222]",
    borderColor: "border-[#222222]",
  },
  "Board Members": {
    title: "Board Members",
    description:
      "Key responsibilities of the board include setting long-term goals, overseeing financial management, ensuring compliance with legal and ethical standards, and fostering partnerships with other organizations.",
    bgColor: "bg-[#F0DC35]",
    borderColor: "border-[#F0DC35]",
  },
  Management: {
    title: "Management",
    description:
      "The management team works closely with the Board of Directors to ensure alignment with the association's goals and objectives. Their responsibilities include project management, financial oversight, resource allocation, and stakeholder engagement.",
    bgColor: "bg-teal-500",
    borderColor: "border-teal-500",
  },
};

const Content = ({ content, setContent }: ContentProps) => {
  const router = useRouter();
  const { title, description, bgColor } = contentData[content];

  return (
    <>
      <div className="relative lg:mt-[130px] mt-[100px] h-max">
        <div className="w-full xl:lg:h-[90%] md:h-[90%] h-[30%] min-h-[200px] xl:lg:min-h-[500px] md:min-h-[500px] bg-[url('/images/bgabout.svg')] bg-cover bg-no-repeat" />
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
