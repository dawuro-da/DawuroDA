"use client";
import { useRouter } from "next/navigation";

export interface VacancyCardItems {
  lastUpdate: string;
  title: string;
  responsibility: string[];
  redirectUrl?: any;
}

const VacancyCard = ({
  lastUpdate,
  responsibility,
  title,
  redirectUrl,
}: VacancyCardItems) => {
  const router = useRouter();
  return (
    <div
      className="border-2 mb-9 border-[#E8E8E8] lg:md:px-10 px-4 py-8 w-4/5 mx-auto cursor-pointer"
      onClick={() => router.push('/vacancies/job-page')}
    >
      <p className="font-light text-[#555555] text-xs">{lastUpdate}</p>
      <h2 className="my-3 font-extrabold text-3xl">{title}</h2>
      <h4 className="font-bold text-base">Responsibilities</h4>
      {responsibility?.map((item, id) => (
        <ul className="list-disc mx-4 font-light text-base" key={id}>
          <li>{item}</li>
        </ul>
      ))}
    </div>
  );
};

export default VacancyCard;
