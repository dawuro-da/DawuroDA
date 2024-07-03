import Footer from "../footer/Footer";
import Naviagtion from "../navigation/Navigation";
import ResourceCard from "./sections/ResourceCard";
import { ResourceCardData } from "./sections/ResourceData";

const ResourcePage = () => {
  return (
    <div>
      <div className="z-40 absolute top-0 w-full">
        <Naviagtion />
      </div>
      <div className="lg:mt-[180px] mt-[100px] gap-0 w-4/5 mx-auto mb-48">
        <ResourceCard data={ResourceCardData} />
      </div>
      <Footer />
    </div>
  );
};

export default ResourcePage;
