import { useState } from "react";
import BoardMemberProfile from "./BoardMemberProfile";

const members = [
  {
    name: "Birhanu Zewudie Zeta",
    jobTitle:
      "Head of the southern Ethiopian regional government bureau of urban infrastructure",
    pic: "/images/birhanuZ.jpg",
  },
  {
    name: "Tilahun Kebede",
    jobTitle: "South Ethiopia Regional State President",
    pic: "/images/tilahunK.jpg",
  },
  {
    name: "Alemtsehay Paulos",
    jobTitle:
      "Ethiopian Minister for Cabinet Affairs and Head of the Prime Minister Office",
    pic: "/images/alemtsehay.jpg",
  },
  {
    name: "Abayneh Abera",
    jobTitle: "Chief Administrator of the Gamo Zone",
    pic: "/icons/avatar1.svg",
  },
  {
    name: "Wondimagegn Taye Dema",
    jobTitle: "Director of the Southern Region Public Health Institute",
    pic: "/icons/avatar1.svg",
  },
  {
    name: "Desalegn Kebede Kaza",
    jobTitle:
      "Head of the Federal Public Defender’s Office at the Federal Supreme Court",
    pic: "/icons/avatar1.svg",
  },
  {
    name: "Awash Abitew Ashagrie",
    jobTitle: "Founder and CEO of Addis Credit and Savings Institution",
    pic: "/icons/avatar1.svg",
  },
  {
    name: "Abayneh Gujo",
    jobTitle:
      " Executive Director of the Federation of Ethiopian Associations of Persons with Disabilities",
    pic: "/icons/avatar1.svg",
  },
  {
    name: "Mahe Boda Member",
    jobTitle: "Founder and CEO of Addis Credit and Savings Institution",
    pic: "/icons/avatar1.svg",
  },
  {
    name: "Mr. Mamo Deboch",
    jobTitle: "Founder and CEO of Addis Credit and Savings Institution",
    pic: "/icons/avatar1.svg",
  },
  {
    name: "Mr. Anjelo Areshe",
    jobTitle: " ",
    pic: "/icons/avatar1.svg",
  },
];

const BoardMember = () => {
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const [selectedMember, setSelectedMember] = useState<any>();

  const toggleDrawer = (open: boolean) => {
    setIsDrawerOpen(open);
  };

  return (
    <>
      <div className="font-light w-full overflow-x-clip">
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
        <div className="grid grid-cols-3 gap-10 w-full ">
          {members.map((member, index) => (
            <div
              key={index}
              className="relative w-full h-[300px] rounded-lg hover:cursor-pointer"
              style={{
                background: `url('${member.pic}')`,
                backgroundSize: "cover",
                backgroundPosition: "center",
              }}
              onClick={() => {
                setIsDrawerOpen(true);
                setSelectedMember(member);
              }}
            >
              <div className="absolute flex flex-col w-full text-white bottom-0 left-0 pb-6 pl-2 pt-6 bg-gradient-to-t from-[rgb(0,0,0,0.9)] to-transparent">
                <span className="font-bold text-xl w-[200px]">
                  {member.name}
                </span>
                <span className="max-w-[200px] truncate text-ellipsis text-lg">
                  {member.jobTitle}
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>

      <BoardMemberProfile
        member={selectedMember}
        handleClose={() => toggleDrawer(false)}
        open={isDrawerOpen}
      />
    </>
  );
};

export default BoardMember;
