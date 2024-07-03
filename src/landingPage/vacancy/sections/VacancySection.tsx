import Naviagtion from "@/landingPage/navigation/Navigation";
import VacancyCard from "./VacancyCard";
import { VacancyData } from "./VacancyData";

const VacancySection = () => {
  return (
    <div className="bg-[#F5F5F5] min-h-screen flex flex-col">
      <div className="z-40 absolute top-0 w-full">
        <Naviagtion />
      </div>
      <div className="w-4/5 mx-auto">
        <div className="text-center lg:mt-[180px] mt-[100px] mb-16">
          <h1 className="lg:text-4xl md:text-2xl text-lg font-extrabold mb-6">
            Vacancies
          </h1>
          <p className="font-light text-[#7C7C7C]">Our Job Openings</p>
        </div>
      </div>
      <div>
        {VacancyData.map((item, id) => (
          <VacancyCard
            key={id}
            title={item.title}
            responsibility={item.responsibility}
            lastUpdate={item.lastUpdate}
          />
        ))}
      </div>
    </div>
  );
};

export default VacancySection;
