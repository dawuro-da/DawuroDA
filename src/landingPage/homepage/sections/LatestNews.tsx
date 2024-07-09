import { Button } from "@mui/material";
import NewsGrid from "./NewsGrid";

const LatestNews = () => {
  return (
    <div className="bg-[#F7F7F7] py-16 flex flex-col items-center w-full">
      <h2 className="font-bold lg:text-4xl md:text-2xl text-xl text-[#1E1E1E] mb-6">
        Latest News
      </h2>
      <p className="mb-6 font-light lg:w-[23%] w-4/5 mx-auto text-center">
        Join us in making a lasting impact. Every donation counts!
      </p>
      <Button
        variant="outlined"
        className="px-7 py-2 text-white rounded bg-primaryColor hover:text-primaryColor"
      >
        News
      </Button>
      <NewsGrid />
    </div>
  );
};

export default LatestNews;
