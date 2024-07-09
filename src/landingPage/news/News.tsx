import Footer from "../footer/Footer";
import Naviagtion from "../navigation/Navigation";
import GridNews from "./sections/GridNews";
import NewsCard from "./sections/NewsCard";

const NewsPage = () => {
  return (
    <div className="w-full">
      <Naviagtion />
      <NewsCard />
      <GridNews />
      <Footer />
    </div>
  );
};

export default NewsPage;
