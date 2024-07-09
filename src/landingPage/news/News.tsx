import Naviagtion from "../navigation/Navigation";
import GridNews from "./sections/GridNews";
import NewsCard from "./sections/NewsCard";

const NewsPage = () => {
  return (
    <>
      <Naviagtion />
      <NewsCard />
      <GridNews />
    </>
  );
};

export default NewsPage;
