import { Button } from "@mui/material";

const SupportRedSection = () => {
  return (
    <div className="xl:lg:px-40 md:px-20 px-10 w-full xl:lg:flex md:flex hidden flex-row items-center justify-between py-12 bg-[#D2232C]">
      <span className="text-white text-xl">
        Support Flood Victims: Rebuild Lives, Restore Hope
      </span>
      <Button
        variant="outlined"
        className="bg-white border-none hover:border-none hover:bg-white text-black font-normal capitalize px-10 py-2"
      >
        Support
      </Button>
    </div>
  );
};

export default SupportRedSection;
