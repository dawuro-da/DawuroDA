import Image from "next/image";
import Link from "next/link";

export interface Job {
  title: string;
  location: string;
  postedDate: string;
  description: string;
  responsibilities: string[];
  qualifications: string[];
  benefits: string[];
}

interface JobProps {
  job: Job;
}

const JobPage = ({ job }: JobProps) => {
  return (
    <div className="min-h-screen p-8">
      <Link href="/vacancies" className="w-fit font-light flex flex-row gap-4">
        <Image src={"/images/back.svg"} height={20} width={20} alt="" />
        <p>Back to Vacancies</p>
      </Link>
      <h1 className="text-3xl font-bold mt-4 mb-8">{job.title}</h1>
      <div className="flex flex-row gap-20 items-center">
        <p className="font-light">Posted on: {job.postedDate}</p>
        <button className="font-light border border-[#8E8E8E] px-4 py-2 flex flex-row items-center rounded-md gap-2">
          <Image src={"/images/sharebtn.svg"} height={15} width={15} alt="" />
          <p>Share</p>
        </button>
      </div>
      <div className="mt-6">
        <h2 className="text-xl font-bold">Description:</h2>
        <div className="mt-2">
          <p>
            <strong className="text-base">Position:</strong> {job.title}
          </p>
          <p>
            <strong>Location:</strong> {job.location}
          </p>
          <h3 className="mt-4 font-semibold">Responsibilities:</h3>
          <ul className="list-disc list-inside mt-2 font-normal">
            {job.responsibilities.map((item: string, id: number) => (
              <li key={id}>{item}</li>
            ))}
          </ul>
          <h3 className="mt-4 font-semibold">Qualifications:</h3>
          <ul className="list-disc list-inside mt-2 font-normal">
            {job.qualifications.map((item: string, id: number) => (
              <li key={id}>{item}</li>
            ))}
          </ul>
          <h3 className="mt-4 font-semibold">Benefits:</h3>
          <ul className="list-disc list-inside mt-2">
            {job.benefits.map((item: string, id: number) => (
              <li key={id} className="my-2">
                {item}
              </li>
            ))}
          </ul>
        </div>
      </div>
      <div className="mt-8">
        <p className="text-black text-xs">Apply via email</p>
        <button className="text-white capitalize bg-[#34a858] font-light shadow-none px-8 py-2 rounded-[5px] cursor-pointer mt-5">
          Submit
        </button>
      </div>
    </div>
  );
};

export default JobPage;
