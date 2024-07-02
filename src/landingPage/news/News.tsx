import Naviagtion from "../navigation/Navigation";
import Initiatives from "./sections/Initiatives";
import NewsCard from "./sections/NewsCard";
import NewsDetail from "./sections/NewsDetail";

const NewsPage = () => {
  return (
    <>
      <Naviagtion />
      <NewsCard />
      <Initiatives />
    </>
  );
};

export default NewsPage;
