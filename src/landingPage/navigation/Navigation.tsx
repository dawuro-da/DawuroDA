import FacebookChat from "../shared/FacebookChat";
import MainNaviagtion from "./MainNavigation";

const Navigation = ({ bg }: { bg?: string }) => {
  return (
    <>
      <FacebookChat />
      <MainNaviagtion bg={bg} />
    </>
  );
};

export default Navigation;
