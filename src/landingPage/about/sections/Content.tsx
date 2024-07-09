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
      "Sed ut perspiciatis unde omnis iste natus error sit voluptatem accusantium doloremque laudantium, totam rem aperiam, eaque ipsa quae ab illo inventore veritatis et quasi architecto beatae vitae dicta sunt explicabo. Nemo enim ipsam voluptatem quia voluptas sit aspernatur aut odit aut fugit, sed quia consequuntur magni dolores eos qui ratione voluptatem sequi nesciunt.",
    bgColor: "bg-[#D2232C]",
    borderColor: "border-[#D2232C]",
  },
  "What We Do": {
    title: "What we do?",
    description:
      "Sed ut perspiciatis unde omnis iste natus error sit voluptatem accusantium doloremque laudantium, totam rem aperiam, eaque ipsa quae ab illo inventore veritatis et quasi architecto beatae vitae dicta sunt explicabo. Nemo enim ipsam voluptatem.",
    bgColor: "bg-primaryColor",
    borderColor: "border-primaryColor",
  },
  "President Message": {
    title: "President Message",
    description:
      "Sed ut perspiciatis unde omnis iste natus error sit voluptatem accusantium doloremque laudantium, totam rem aperiam, eaque ipsa quae ab illo inventore veritatis et quasi architecto beatae vitae dicta sunt explicabo. Nemo enim ipsam voluptatem",
    bgColor: "bg-[#13A6D9]",
    borderColor: "border-[#13A6D9]",
  },
  "Mission, Vision, Goals": {
    title: "Mission, Vision, Goals",
    description:
      "Sed ut perspiciatis unde omnis iste natus error sit voluptatem accusantium doloremque laudantium, totam rem aperiam, eaque ipsa quae ab illo inventore veritatis et quasi architecto beatae vitae dicta sunt explicabo. Nemo enim ipsam voluptatem",
    bgColor: "bg-[#222222]",
    borderColor: "border-[#222222]",
  },
  "Board Members": {
    title: "Board Members",
    description:
      "Sed ut perspiciatis unde omnis iste natus error sit voluptatem accusantium doloremque laudantium, totam rem aperiam, eaque ipsa quae ab illo inventore veritatis et quasi architecto beatae vitae dicta sunt explicabo. Nemo enim ipsam voluptatem",
    bgColor: "bg-[#F0DC35]",
    borderColor: "border-[#F0DC35]",
  },
  Management: {
    title: "Management",
    description: "Content for Management.",
    bgColor: "bg-teal-500",
    borderColor: "border-teal-500",
  },
};

const Content = ({ content, setContent }: ContentProps) => {
  const router = useRouter();
  const { title, description, bgColor } = contentData[content];

  return (
    <>
      <div className="relative lg:mt-[180px] mt-[100px] h-max">
        <Image
          src={"/images/bgabout.svg"}
          height={10}
          width={10}
          alt=""
          className="w-full h-[90%]"
        />
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
          <p className="md:text-sm text-xs md:block hidden">
            {description}
          </p>
        </div>
      </div>
    </>
  );
};

export default Content;
