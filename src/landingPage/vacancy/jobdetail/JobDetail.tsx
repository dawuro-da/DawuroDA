import Footer from "../../footer/Footer";
import Naviagtion from "../../navigation/Navigation";
import { JobData } from "./sections/JobData";
import JobDetailPage from "./sections/JobDetailPage";

const JobDetail = () => {
  return (
    <div className="bg-[#F5F5F5] min-h-screen flex flex-col">
      <div className="z-40 absolute top-0 w-full">
        <Naviagtion />
      </div>
      <div className="w-4/5 mx-auto lg:mt-[180px] mt-[100px] pb-48 ">
        <JobDetailPage job={JobData} />
      </div>
      <Footer />
    </div>
  );
};

export default JobDetail;
