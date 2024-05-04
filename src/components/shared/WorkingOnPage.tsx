import { Skeleton } from "@mui/material";

const WorkingOnPage = () => {
  return (
    <div className="p-20 w-full h-full">
      <span className="text-3xl">This Page is on progress</span>
      <Skeleton style={{ height: "50%", width: "100%" }} />
    </div>
  );
};

export default WorkingOnPage;
