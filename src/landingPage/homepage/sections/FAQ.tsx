import Image from "next/image";
import { useState } from "react";

interface AccordionItemProps {
  title: string;
  content: string;
  isOpen?: boolean;
}

const AccordionItem = ({
  title,
  content,
  isOpen = false,
}: AccordionItemProps) => {
  const [isOpenState, setIsOpenState] = useState(isOpen);

  return (
    <div className="border rounded-md mb-2">
      <div
        className="flex justify-between items-center p-4 cursor-pointer"
        onClick={() => setIsOpenState(!isOpenState)}
      >
        <h3 className="text-lg text-left font-bold">{title}</h3>
        <Image src={'/images/arrowdown.svg'} height={30} width={30} alt=""/>
      </div>
      {isOpenState && (
        <div className="p-4">
          <p className="text-[#686868] font-light text-sm text-left">{content}</p>
        </div>
      )}
    </div>
  );
};

const Accordion = () => {
  const items = [
    {
      title: "What are the requirements to join the association",
      content:
        "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.",
    },
    {
      title: "What are the requirements to join the association",
      content:
        "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.",
    },
    {
      title: "What are the requirements to join the association",
      content:
        "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.",
    },
  ];

  return (
    <div className="w-4/5 mx-auto md:p-4 p-0">
      {items.map((item, index) => (
        <AccordionItem
          key={index}
          title={item.title}
          content={item.content}
          isOpen={index === 0}
        />
      ))}
    </div>
  );
};

const FAQ = () => {
  return (
    <div className="py-10 pb-28">
      <h2 className="font-bold lg:text-4xl md:text-2xl text-xl mb-6">FAQ</h2>
      <p className="md:mb-20 mb-10 font-light lg:w-3/12 w-4/5 mx-auto text-center">
        Find Answers to Common Questions About Our Programs and initiatives
      </p>
      <Accordion />
    </div>
  );
};

export default FAQ;
