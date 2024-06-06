import { Delete, Edit, SearchOutlined, Upload } from "@mui/icons-material";
import { Button, IconButton, TextField } from "@mui/material";
import Image from "next/image";
import { useState } from "react";
import { useForm } from "react-hook-form";

const Partnership = () => {
  const [searching, setSearching] = useState<boolean>(false);
  const [searchText, setSearchText] = useState<string>("");

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
    watch,
  } = useForm();

  return (
    <div className="flex flex-row flex-1 mt-2 text-[#7C7C7C] h-full">
      <div className="h-full flex flex-col">
        <div className="lg:pl-[40px] md:pl-[40px] pl-[20px] py-4 pr-6 flex flex-col border-[1px] gap-4 border-[#d1d1d1] border-r-0 h-[140px]">
          <div className="flex flex-row justify-between items-center">
            <span className="font-bold text-xl">Partnership</span>
            <span className="flex flex-rwo items-center gap-2">
              <Image
                src={"/icons/bx_edit.svg"}
                alt=""
                width={20}
                height={20}
                className=""
              />
              <span className="rotate-90 font-bold text-xl">...</span>
            </span>
          </div>
          <TextField
            fullWidth
            id="navbar-searchfield"
            size="small"
            name="searchText"
            variant="filled"
            value={searchText}
            onChange={(e) => {
              if (e.target.value === "") {
                setSearching(!searching);
              }
              setSearchText(e.target.value);
            }}
            onKeyDown={(e) => {
              if (e.key === "Enter") {
                setSearching(!searching);
              }
            }}
            hiddenLabel
            placeholder="Search by name, id, phone..."
            InputProps={{
              startAdornment: (
                <IconButton
                  style={{
                    borderRadius: "16px",
                    borderLeft: 20,
                  }}
                  onClick={() => {
                    setSearching(!searching);
                  }}
                >
                  <SearchOutlined style={{ color: "#555555" }} />
                </IconButton>
              ),
              disableUnderline: true,
              sx: {
                width: "100%",
                color: "#555555",
                backgroundColor: "#ffffff",
                borderRadius: "16px",
                paddingLeft: 0,
                paddingRight: 2,
              },
            }}
          />
        </div>
        <div className="flex-1 px-4 mt-6 flex flex-col gap-4">
          {[1, 2, 3, 4].map((item, index) => {
            return (
              <div
                key={item}
                className="relative w-full h-[50px] flex flex-row items-center gap-2 hover:bg-[#e5e5e6] cursor-pointer"
              >
                <Image
                  src={"/icons/list.png"}
                  alt=""
                  height={50}
                  width={50}
                  className="h-full"
                />
                <span className=" overflow-clip text-ellipsis text-nowrap flex-1 max-w-[70%]">
                  Charitable Donations to this foasdfsklajf asdflj fas
                </span>
                <IconButton className="absolute right-0 ">
                  <Image
                    src={
                      index % 2 === 0
                        ? "/icons/uploadGreen.svg"
                        : "/icons/draft.svg"
                    }
                    alt=""
                    width={20}
                    height={20}
                    className=""
                  />
                </IconButton>
              </div>
            );
          })}
        </div>
      </div>
      <div className="border-[1px] border-[#d1d1d1] gap-4 flex-1 overflow-y-auto h-full hiddenscrollbar">
        <div className="h-[139px] w-full border-b-[1px] border-[#d1d1d1] lg:pr-[40px] md:pr-[40px] pr-[20px] pl-6 flex flex-row items-center"></div>
        <form className="relative flex-1 flex flex-col h-full p-10">
          <div className="flex flex-col gap-4 text-fadeTextColor h-full">
            <label>Partner Name</label>
            <TextField
              {...register("partnerName")}
              variant="outlined"
              error={Boolean(!!errors.partnerName)}
              helperText={
                !!errors.partnerName && errors.partnerName.message?.toString()
              }
              sx={{ backgroundColor: "white" }}
              inputProps={{ style: { padding: 10 } }}
            />
            <div className="flex flex-col gap-1 text-fadeTextColor">
              <label>Partner Name in Amharic</label>
              <TextField
                {...register("partnerNameAmharic")}
                variant="outlined"
                error={Boolean(!!errors.partnerNameAmharic)}
                helperText={
                  !!errors.partnerNameAmharic &&
                  errors.partnerNameAmharic.message?.toString()
                }
                sx={{ backgroundColor: "white" }}
                inputProps={{ style: { padding: 10 } }}
              />
            </div>
            <div className="flex flex-col gap-3 xl:col-span-1 md:col-span-2 sm:col-span-2">
              <span className="text-titleColor text-sm font-bold">Logo</span>
              <span className="relative flex flex-row items-center px-6 border-2 border-dashed rounded-[3px] py-2 cursor-pointer h-[65px]">
                <span className="flex flex-row items-center px-2 gap-2 text-titleColor cursor-pointer">
                  <Image
                    src={"/icons/greyGallery.svg"}
                    alt=""
                    height={20}
                    width={20}
                  />
                  <span>
                    {watch("logo") && watch("logo")[0]?.name
                      ? watch("logo")[0]?.name
                      : "Upload"}
                  </span>
                </span>
                <input
                  id="logo"
                  {...register("logo", {
                    required: "logo is required",
                    validate: {
                      fileSize: (value: any) => {
                        if (value && value[0]) {
                          return (
                            value[0].size < 1048576 ||
                            "File size must be less than 1MB"
                          );
                        }
                        return true;
                      },
                    },
                  })}
                  type="file"
                  placeholder=""
                  className="z-10 absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                />
                <Button className="flex flex-row items-center justify-center outline-none z-0 gap-2 absolute bg-white text-titleColor right-4 px-4 py-2 cursor-pointer">
                  <Image
                    src={"/icons/uploadIcon.svg"}
                    alt=""
                    height={20}
                    width={20}
                  />
                  <span>Upload</span>
                </Button>
              </span>
              {/* <span className="text-[10px] text-titleColor">
                Image size must be 600*600 File size must be less than 1MB
              </span> */}
            </div>
            <div className="flex flex-col gap-1 text-fadeTextColor">
              <label>Bio</label>
              <TextField
                {...register("bio")}
                variant="outlined"
                multiline
                rows={4}
                error={Boolean(!!errors.bio)}
                helperText={!!errors.bio && errors.bio.message?.toString()}
                sx={{ backgroundColor: "white" }}
                inputProps={{ style: { padding: 0 } }}
              />
            </div>
            <div className="flex flex-col gap-1 text-fadeTextColor">
              <label>Bio in Amharic</label>
              <TextField
                {...register("bioAmharic")}
                variant="outlined"
                multiline
                rows={4}
                error={Boolean(!!errors.bioAmharic)}
                helperText={
                  !!errors.bioAmharic && errors.bioAmharic.message?.toString()
                }
                sx={{ backgroundColor: "white" }}
                inputProps={{ style: { padding: 0 } }}
              />
            </div>
            <div className="py-4 border-t-[1px] flex-row flex items-center justify-end gap-2 w-full">
              <Button
                variant="contained"
                type="submit"
                className="flex flex-row items-center justify-center gap-2 shadow-none"
              >
                <Upload /> <span>Publish</span>
              </Button>
              <div className="border-l-[2px] ">
                <IconButton>
                  <Delete />
                </IconButton>
              </div>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
};

export default Partnership;
