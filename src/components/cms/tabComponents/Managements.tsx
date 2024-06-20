import { PageState } from "@/components/shared/CustomizedDatagrid";
import { showToastAction } from "@/redux/actions";
import { Delete, Edit, SearchOutlined, Upload } from "@mui/icons-material";
import {
  Button,
  Checkbox,
  CircularProgress,
  IconButton,
  TextField,
} from "@mui/material";
import { Management } from "@prisma/client";
import axios from "axios";
import Image from "next/image";
import { useEffect, useState } from "react";
import { FieldValues, useForm } from "react-hook-form";
import { useDispatch } from "react-redux";
import ManagementEdit from "./ManagementEdit";

const Managements = () => {
  const dispatch = useDispatch();
  const [refetch, setRefetch] = useState<boolean>(false);
  const [loading, setLoading] = useState<boolean>(false);
  const [fetchLoading, setfetchLoading] = useState<boolean>(false);
  const [searchText, setSearchText] = useState<string>("");
  const [managements, setManagements] = useState<Management[]>();
  const [totalCount, setTotalCount] = useState<number>(0);
  const [selectedManagement, setSelectedManagement] = useState<Management>();
  const [createManagementForm, setCreateManagementForm] = useState(false);
  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
    watch,
  } = useForm();

  const fetchmanagement = async ({ page, pageSize }: PageState) => {
    setfetchLoading(true);
    const result = await axios.post("/api/cms/management/fetch", {
      page,
      pageSize,
      searchText,
    });

    if (result.data.success) {
      setManagements(result.data.value.managements);
      setTotalCount(result.data.value.total);
    }
    setfetchLoading(false);
  };

  useEffect(() => {
    fetchmanagement({ page: 1, pageSize: 30 });
  }, [refetch]);

  useEffect(() => {}, [selectedManagement]);

  const handleRegister = async (values: FieldValues) => {
    setLoading(true);
    try {
      const res = await axios.post("/api/cms/management/create", {
        ...values,
        photo: "/mike/new",
      });

      if (res?.status === 200) {
        dispatch(
          showToastAction({
            message: "Successfully Done",
            type: "success",
          })
        );
        setRefetch(!refetch);
        reset();
      }
    } catch (err: any) {
      console.error(err);
      dispatch(
        showToastAction({
          message: err?.response?.data?.error ?? "something went wrong",
          type: "error",
        })
      );
    }
    setLoading(false);
  };

  return (
    <div className="flex flex-row flex-1 mt-2 text-[#7C7C7C] h-full w-full min-w-fit">
      <div className="h-full flex flex-col max-w-[400px] min-w-[300px] border-r-[1px] border-[#d1d1d1]">
        <div className="lg:pl-[40px] md:pl-[40px] pl-[20px] py-4 pr-6 flex flex-col border-[1px] gap-4 border-[#d1d1d1] border-r-0 h-[140px]">
          <div className="flex flex-row justify-between items-center">
            <span className="font-bold text-xl">Managements</span>
            <span className="flex flex-rwo items-center gap-2">
              <Image
                src={"/icons/bx_edit.svg"}
                alt=""
                width={20}
                height={20}
                className="cursor-pointer"
                onClick={() => {
                  setSelectedManagement(undefined);
                  setCreateManagementForm(true);
                }}
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
                setRefetch(!refetch);
              }
              setSearchText(e.target.value);
            }}
            onKeyDown={(e) => {
              if (e.key === "Enter") {
                setRefetch(!refetch);
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
                    setRefetch(!refetch);
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
          {fetchLoading ? (
            <CircularProgress />
          ) : (
            managements?.map((item, index) => {
              return (
                <div
                  key={item.id}
                  onClick={() => setSelectedManagement(item)}
                  className={`relative w-full h-[50px] flex flex-row items-center ${
                    selectedManagement?.id === item.id && "bg-[#e5e5e6]"
                  } gap-2 hover:bg-[#e5e5e6] cursor-pointer`}
                >
                  <Image
                    src={"/icons/list.png"}
                    alt=""
                    height={50}
                    width={50}
                    className="h-full"
                  />
                  <span className=" overflow-clip text-ellipsis text-nowrap flex-1 max-w-[70%]">
                    {item.managerName}
                  </span>
                  <IconButton className="absolute right-0 ">
                    <Image
                      src={
                        !item.isDraft
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
            })
          )}
        </div>
      </div>
      {selectedManagement ? (
        <ManagementEdit
          selectedManagement={selectedManagement}
          refetch={refetch}
          setRefetch={setRefetch}
          setSelectedManagement={setSelectedManagement}
        />
      ) : createManagementForm ? (
        <div className="min-w-[350px] border-[1px] border-[#d1d1d1] gap-4 flex-1 overflow-y-auto h-full hiddenscrollbar">
          <div className="h-[139px] w-full border-b-[1px] border-[#d1d1d1] lg:pr-[40px] md:pr-[40px] pr-[20px] pl-6 flex flex-row items-center"></div>
          <form
            onSubmit={handleSubmit(handleRegister)}
            className="relative flex-1 flex flex-col h-full p-10"
          >
            <div className="flex flex-col gap-4 text-fadeTextColor h-full">
              <label>Manager Name</label>
              <TextField
                {...register("managerName")}
                variant="outlined"
                error={Boolean(!!errors.managerName)}
                helperText={
                  !!errors.managerName && errors.managerName.message?.toString()
                }
                sx={{ backgroundColor: "white" }}
                inputProps={{ style: { padding: 10 } }}
              />
              <div className="flex flex-col gap-1 text-fadeTextColor">
                <label>Manager Name in Amharic</label>
                <TextField
                  {...register("managerNameAmharic")}
                  variant="outlined"
                  error={Boolean(!!errors.managerNameAmharic)}
                  helperText={
                    !!errors.managerNameAmharic &&
                    errors.managerNameAmharic.message?.toString()
                  }
                  sx={{ backgroundColor: "white" }}
                  inputProps={{ style: { padding: 10 } }}
                />
              </div>
              <div className="flex flex-col gap-1 text-fadeTextColor">
                <label>Job Title</label>
                <TextField
                  {...register("job")}
                  variant="outlined"
                  error={Boolean(!!errors.job)}
                  helperText={!!errors.job && errors.job.message?.toString()}
                  sx={{ backgroundColor: "white" }}
                  inputProps={{ style: { padding: 10 } }}
                />
              </div>
              <div className="flex flex-col gap-1 text-fadeTextColor">
                <label>Job Title in Amharic</label>
                <TextField
                  {...register("jobAmharic")}
                  variant="outlined"
                  error={Boolean(!!errors.jobAmharic)}
                  helperText={
                    !!errors.jobAmharic && errors.jobAmharic.message?.toString()
                  }
                  sx={{ backgroundColor: "white" }}
                  inputProps={{ style: { padding: 10 } }}
                />
              </div>
              <div className="flex flex-col gap-3 xl:col-span-1 md:col-span-2 sm:col-span-2">
                <span className="text-titleColor text-sm font-bold">Photo</span>
                <span className="relative flex flex-row items-center px-6 border-2 border-dashed rounded-[3px] py-2 cursor-pointer h-[65px]">
                  <span className="flex flex-row items-center px-2 gap-2 text-titleColor cursor-pointer">
                    <Image
                      src={"/icons/greyGallery.svg"}
                      alt=""
                      height={20}
                      width={20}
                    />
                    <span>
                      {watch("photo") && watch("photo")[0]?.name
                        ? watch("photo")[0]?.name
                        : "Upload"}
                    </span>
                  </span>
                  <input
                    id="photo"
                    {...register("photo", {
                      required: "photo is required",
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
                {false && (
                  <span className="text-[10px] text-titleColor">
                    Image size must be 600*600 File size must be less than 1MB
                  </span>
                )}
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
              <div className="py-4 border-t-[1px] flex-row flex items-center justify-between gap-2 w-full">
                <div className="flex flex-row items-center gap-1">
                  <Checkbox {...register("isDraft")} />
                  <span>Save as Draft</span>
                </div>
                <Button
                  variant="contained"
                  type="submit"
                  className="flex flex-row items-center justify-center gap-2 shadow-none capitalize text-lg h-[48px]"
                >
                  {loading ? (
                    <CircularProgress />
                  ) : watch("isDraft") ? (
                    <span>Save Draft</span>
                  ) : (
                    <>
                      <Upload /> <span>Publish</span>
                    </>
                  )}
                </Button>
              </div>
            </div>
          </form>
        </div>
      ) : (
        <></>
      )}
    </div>
  );
};

export default Managements;
