import { Close } from "@mui/icons-material";
import { Drawer, IconButton } from "@mui/material";
import { Management } from "@prisma/client";
import Image from "next/image";

const BoardMemberProfile = ({
  handleClose,
  open,
  manager,
}: {
  manager: Management;
  open: boolean;
  handleClose: () => void;
}) => {
  return (
    <Drawer anchor="right" open={open} onClose={handleClose}>
      <div className="font-light max-w-[700px] pt-2 ">
        <div className="w-full flex flex-row items-center justify-between">
          <span></span>
          <IconButton
            onClick={() => {
              handleClose();
            }}
          >
            <Close />
          </IconButton>
        </div>
        <div className="w-[70%] mx-auto">
          <Image
            src={manager?.photo}
            height={20}
            width={20}
            alt=""
            unoptimized
            className="w-full"
          />
          <h1 className="my-3 font-extrabold text-4xl">
            {manager?.managerName}
          </h1>
          <p className="font-medium">{manager?.job}</p>
        </div>
        <div className="w-[70%] mx-auto my-6">
          <p>{manager?.bio}</p>
        </div>
      </div>
    </Drawer>
  );
};

export default BoardMemberProfile;
