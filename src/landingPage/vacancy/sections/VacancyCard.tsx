"use client";
import { getRelativeTimeSinceDate } from "@/util/date";
import { Job } from "@prisma/client";
import { useRouter } from "next/navigation";

const VacancyCard = ({ job }: { job: Job }) => {
  const router = useRouter();
  return (
    <div
      className="border-2 mb-9 border-[#E8E8E8] lg:md:px-10 px-4 py-8 w-4/5 mx-auto cursor-pointer"
      onClick={() => router.push(`/vacancies/${job.id}`)}
    >
      <p className="font-light text-[#555555] text-xs">
        {getRelativeTimeSinceDate(job.updated_at)}
      </p>
      <h2 className="my-3 font-extrabold text-3xl">{job.jobTitle}</h2>
      <h4 className="font-bold text-base">Description</h4>
      <p>
        {job.jobDescription?.slice(0, 300)}{" "}
        {job.jobDescription && job.jobDescription?.length > 300 && "..."}
      </p>
    </div>
  );
};

export default VacancyCard;
