import { Close } from "@mui/icons-material";
import { Drawer, IconButton } from "@mui/material";
import Image from "next/image";

const BoardMemberProfile = ({
  handleClose,
  open,
  member,
}: {
  member: any;
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
            src={member?.pic}
            height={20}
            width={20}
            alt=""
            unoptimized
            className="w-full"
          />
          <h1 className="my-3 font-extrabold text-4xl">{member?.name}</h1>
          <p className="font-medium">{member?.jobTitle}</p>
          <h3 className="my-3 font-semibold text-lg">Experiences</h3>
        </div>
        <div className="w-[70%] mx-auto">
          <p>
            Sed ut perspiciatis unde omnis iste natus error sit voluptatem
            accusantium doloremque laudantium, totam rem aperiam, eaque ipsa
            quae ab illo inventore veritatis et quasi architecto beatae vitae
            dicta sunt explicabo. Nemo enim ipsam voluptatem quia voluptas sit
            aspernatur aut odit aut fugit, sed quia consequuntur magni dolores
            eos qui ratione voluptatem sequi nesciunt. Neque porro quisquam est,
            qui dolorem ipsum quia dolor sit amet, consectetur, adipisci velit,
            sed quia non numquam eius modi tempora incidunt ut labore et dolore
            magnam aliquam quaerat voluptatem.
          </p>
          <br />
          <ul className="list-disc mx-4">
            <li>
              Ut enim ad minima veniam, quis nostrum exercitationem ullam
              corporis suscipit laboriosam, nisi ut aliquid ex ea commodi
              consequatur?
            </li>
            <li>
              Quis autem vel eum iure reprehenderit qui in ea voluptate velit
              esse quam nihil molestiae consequatur, vel illum qui dolorem eum
              fugiat quo voluptas nulla pariatur?
            </li>
            <li>
              Sed ut perspiciatis unde omnis iste natus error sit voluptatem
              accusantium doloremque laudantium, totam rem aperiam, eaque ipsa
              quae ab illo inventore veritatis et quasi architecto beatae vitae
              dicta sunt explicabo.
            </li>
          </ul>
          <br />
          <p>
            Nemo enim ipsam voluptatem quia voluptas sit aspernatur aut odit aut
            fugit, sed quia consequuntur magni dolores eos qui ratione
            voluptatem sequi nesciunt. Neque porro quisquam est, qui dolorem
            ipsum quia dolor sit amet, consectetur, adipisci velit, sed quia non
            numquam eius modi tempora incidunt ut labore et dolore magnam
            aliquam quaerat voluptatem. Ut enim ad minima veniam, quis nostrum
            exercitationem ullam corporis suscipit laboriosam, nisi ut aliquid
            ex ea commodi consequatur? Quis autem vel eum iure reprehenderit qui
            in ea voluptate velit esse quam nihil molestiae consequatur, vel
            illum qui dolorem eum fugiat quo voluptas nulla pariatur?
          </p>
        </div>
      </div>
    </Drawer>
  );
};

export default BoardMemberProfile;
