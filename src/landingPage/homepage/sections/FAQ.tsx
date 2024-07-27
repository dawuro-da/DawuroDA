import { Skeleton } from "@mui/material";
import { Faq } from "@prisma/client";
import axios from "axios";
import Image from "next/image";
import { useEffect, useState } from "react";

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
        <Image src={"/images/arrowdown.svg"} height={30} width={30} alt="" />
      </div>
      {isOpenState && (
        <div className="p-4">
          <p className="text-[#686868] font-light text-sm text-left">
            {content}
          </p>
        </div>
      )}
    </div>
  );
};

const Accordion = () => {
  const [faqs, setFaqs] = useState<Faq[]>();
  const [loading, setLoading] = useState(false);

  const fetchFaqs = async () => {
    setLoading(true);
    try {
      const res = await axios.post("/api/cms/faq/fetch", {
        page: 1,
        pageSize: 10,
      });
      if (res.data.success) {
        const latestFaqs = res.data.value.faqs;
        setFaqs(latestFaqs);
      }
    } catch (err) {
      console.error(err);
    }
    setLoading(false);
  };

  useEffect(() => {
    fetchFaqs();
  }, []);

  return (
    <div id="faqs" className="w-4/5 mx-auto md:p-4 p-0">
      {loading ? (
        <Skeleton className="min-h-[400px] pt-0" />
      ) : (
        faqs?.map((item, index) => (
          <AccordionItem
            key={index}
            title={item.question}
            content={item.answer}
            isOpen={index === 0}
          />
        ))
      )}
    </div>
  );
};

const FAQ = () => {
  return (
    <div className="py-10 pb-28">
      <h2 className="font-bold lg:text-4xl md:text-2xl text-xl mb-6 text-center">
        FAQ
      </h2>
      <p className="md:mb-20 mb-10 font-light lg:w-3/12 w-4/5 mx-auto text-center">
        Find Answers to Common Questions About Our Programs and initiatives
      </p>
      <Accordion />
    </div>
  );
};

export default FAQ;
