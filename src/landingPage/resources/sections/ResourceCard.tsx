import Image from "next/image";

export interface ResourceCardItems {
  title: string;
  description: string;
  fileItems: {
    title: string;
    size: string;
  };
}

interface ResourceCardProps {
  data: ResourceCardItems[];
}

const ResourceCard = ({ data }: ResourceCardProps) => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {data.map((item, id) => (
        <div className="w-full shadow-lg space-y-6 py-6 px-4 mb-7" key={id}>
          <h1 className="font-bold text-lg">{item.title}</h1>
          <p className="font-normal h-14">{item.description}</p>
          <div className="flex flex-row gap-2">
            <Image src={"/images/file.svg"} height={30} width={30} alt="" />
            <div>
              <p className="font-semibold text-xs mb-1">
                {item.fileItems.title}
              </p>
              <p className="text-xs font-light text-[#7C7C7C]">
                {item.fileItems.size}
              </p>
            </div>
          </div>
          <button className="text-white w-full flex flex-row py-3 rounded-md bg-primaryColor justify-center items-center gap-2">
            <Image
              src={"/images/arrowdown2.svg"}
              height={20}
              width={20}
              alt=""
            />
            <p>Download</p>
          </button>
        </div>
      ))}
    </div>
  );
};

export default ResourceCard;
