import Footer from "../footer/Footer";
import Naviagtion from "../navigation/Navigation";
import NewsCard from "./sections/NewsCard";

const NewsPage = () => {
  return (
    <div className="w-full">
      <Naviagtion />
      <NewsCard />
      
      <Footer />
    </div>
  );
};

export default NewsPage;
