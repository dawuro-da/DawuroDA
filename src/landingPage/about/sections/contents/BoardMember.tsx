import { useState } from "react";
import Image from "next/image";
import AnchorTemporaryDrawer from "../AnchorTemporaryDrawer";
import BruktawitProfile from "../drawerContent/ManagerProfile";

const BoardMember = () => {
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const [drawerContent, setDrawerContent] = useState(<div />);

  const toggleDrawer = (open: boolean) => {
    setIsDrawerOpen(open);
  };

  const handleImageClick = (content: JSX.Element) => {
    setDrawerContent(content);
    toggleDrawer(true);
  };

  return (
    <div className="font-light">
      <div className="mb-4">
        <h1 className="font-bold text-lg">Board Members</h1>
        <br />
        <p className="mb-8">
          Enim ad minima veniam, quis nostrum exercitationem ullam corporis
          suscipit laboriosam, nisi ut aliquid ex ea commodi consequatur? Quis
          autem vel eum iure reprehenderit qui in ea voluptate velit esse quam
          nihil molestiae consequatur, vel illum qui dolorem eum fugiat quo
          voluptas nulla pariatur
        </p>
      </div>
      <div className="grid grid-cols-3 gap-4">
      <Image
          src={"/images/bm1.svg"}
          height={20}
          width={20}
          alt=""
          className="w-4/5 cursor-pointer"
          onClick={() => handleImageClick(<BruktawitProfile />)}
        />
      </div>

      <AnchorTemporaryDrawer
        isOpen={isDrawerOpen}
        toggleDrawer={toggleDrawer}
        content={drawerContent}
      />
    </div>
  );
};

export default BoardMember;