import { PageState } from "@/components/shared/CustomizedDatagrid";
import { showToastAction } from "@/redux/actions";
import {
  Close,
  Delete,
  Edit,
  SearchOutlined,
  Upload,
} from "@mui/icons-material";
import {
  Button,
  Checkbox,
  CircularProgress,
  IconButton,
  TextField,
} from "@mui/material";
import { Initiative } from "@prisma/client";
import axios from "axios";
import Image from "next/image";
import { useEffect, useState } from "react";
import { FieldValues, useFieldArray, useForm } from "react-hook-form";
import { useDispatch } from "react-redux";
import InitiativeEdit from "./InitiativeEdit";

const Initiatives = () => {
  const dispatch = useDispatch();
  const [refetch, setRefetch] = useState<boolean>(false);
  const [loading, setLoading] = useState<boolean>(false);
  const [fetchLoading, setfetchLoading] = useState<boolean>(false);
  const [searchText, setSearchText] = useState<string>("");
  const [initiatives, setInitiatives] = useState<Initiative[]>();
  const [totalCount, setTotalCount] = useState<number>(0);
  const [selectedInitiative, setSelectedInitiative] = useState<Initiative>();
  const [createInitiativeForm, setCreateInitiativeForm] = useState(false);
  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
    watch,
    control,
    setValue,
  } = useForm();
  const { fields, append, remove } = useFieldArray({
    control,
    name: "featuredImages",
  });

  const fetchInitiative = async ({ page, pageSize }: PageState) => {
    setfetchLoading(true);
    const result = await axios.post("/api/cms/initiative/fetch", {
      page,
      pageSize,
      searchText,
    });

    if (result.data.success) {
      setInitiatives(result.data.value.initiatives);
      setTotalCount(result.data.value.total);
    }
    setfetchLoading(false);
  };

  useEffect(() => {
    fetchInitiative({ page: 1, pageSize: 30 });
  }, [refetch]);

  useEffect(() => {
    append("/icons/list.svg");
  }, []);

  useEffect(() => {}, [selectedInitiative]);

  const handleRegister = async (values: FieldValues) => {
    setLoading(true);
    const {
      featuredImages,
      nameOfInitiative,
      nameOfInitiativeAmharic,
      youtubeLink,
      body,
      bodyAmharic,
      isDraft,
    } = values;
    const formData = new FormData();
    for (let k = 0; k < featuredImages.length; k++) {
      formData.append("featuredImages", featuredImages[k][0]);
    }
    formData.append("nameOfInitiative", nameOfInitiative);
    formData.append("nameOfInitiativeAmharic", nameOfInitiativeAmharic);
    formData.append("body", body);
    formData.append("youtubeLink", youtubeLink);
    formData.append("bodyAmharic", bodyAmharic);
    formData.append("isDraft", isDraft);

    try {
      const res = await axios.post("/api/cms/initiative/create", formData);

      if (res?.status === 200) {
        dispatch(
          showToastAction({
            message: "Successfully Done",
            type: "success",
          })
        );
        reset();
        setValue("featuredImages", "");
        setRefetch(!refetch);
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
            <span className="font-bold text-xl">Initiatives</span>
            <span className="flex flex-rwo items-center gap-2">
              <Image
                src={"/icons/bx_edit.svg"}
                alt=""
                width={20}
                height={20}
                className="cursor-pointer"
                onClick={() => {
                  setSelectedInitiative(undefined);
                  setCreateInitiativeForm(true);
                }}
              />
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
        <div className="flex-1 px-4 mt-6 flex flex-col gap-4 overflow-y-auto hiddenscrollbar">
          {fetchLoading ? (
            <CircularProgress />
          ) : (
            initiatives?.map((item, index) => {
              return (
                <div
                  key={item.id}
                  onClick={() => setSelectedInitiative(item)}
                  className={`relative w-full h-[50px] flex flex-row items-center ${
                    selectedInitiative?.id === item.id && "bg-[#e5e5e6]"
                  } gap-2 hover:bg-[#e5e5e6] cursor-pointer`}
                >
                  <Image
                    src={item.featuredImages[0]}
                    alt=""
                    height={50}
                    width={50}
                    className="h-full"
                  />
                  <span className=" overflow-clip text-ellipsis text-nowrap flex-1 max-w-[70%]">
                    {item.nameOfInitiative}
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
      {selectedInitiative ? (
        <InitiativeEdit
          selectedInitiative={selectedInitiative}
          refetch={refetch}
          setRefetch={setRefetch}
          setSelectedInitiative={setSelectedInitiative}
        />
      ) : createInitiativeForm ? (
        <div className="min-w-[350px] border-[1px] border-[#d1d1d1] gap-4 flex-1 overflow-y-auto h-full hiddenscrollbar">
          <div className="h-[139px] w-full border-b-[1px] border-[#d1d1d1] lg:pr-[40px] md:pr-[40px] pr-[20px] pl-6 flex flex-row items-center">
            Increasing Productivity and Production
          </div>
          <form
            onSubmit={handleSubmit(handleRegister)}
            className="relative flex-1 flex flex-col h-full p-10"
          >
            <div className="flex flex-col gap-4 text-titleColor h-full">
              <label>Name of the intiative</label>
              <TextField
                {...register("nameOfInitiative", { required: "required" })}
                variant="outlined"
                error={Boolean(!!errors.nameOfInitiative)}
                helperText={
                  !!errors.nameOfInitiative &&
                  errors.nameOfInitiative.message?.toString()
                }
                sx={{ backgroundColor: "white" }}
                inputProps={{ style: { padding: 10 } }}
              />
              <div className="flex flex-col gap-1 text-titleColor">
                <label>Name of the intiative in Amharic</label>
                <TextField
                  {...register("nameOfInitiativeAmharic", {
                    required: "required",
                  })}
                  variant="outlined"
                  error={Boolean(!!errors.nameOfInitiativeAmharic)}
                  helperText={
                    !!errors.nameOfInitiativeAmharic &&
                    errors.nameOfInitiativeAmharic.message?.toString()
                  }
                  sx={{ backgroundColor: "white" }}
                  inputProps={{ style: { padding: 10 } }}
                />
              </div>
              {fields.map((field, index) => (
                <div
                  key={field.id}
                  className="flex flex-col gap-3 xl:col-span-1 md:col-span-2 sm:col-span-2"
                >
                  {index === 0 && (
                    <span className="text-titleColor text-sm font-bold">
                      Featured Images
                    </span>
                  )}
                  <span className="flex flex-row gap-1">
                    <span className="flex-1 relative flex flex-row items-center px-6 border-2 border-dashed rounded-[3px] py-2 cursor-pointer h-[65px]">
                      <span className="flex flex-row items-center px-2 gap-2 text-titleColor cursor-pointer">
                        <Image
                          src={"/icons/greyGallery.svg"}
                          alt=""
                          height={20}
                          width={20}
                        />
                        <span>
                          {typeof watch("featuredImages")?.[index] === "string"
                            ? watch("featuredImages")?.[index]
                            : watch("featuredImages")?.[index]?.[0]?.name
                            ? watch("featuredImages")?.[index]?.[0]?.name
                            : "Upload"}
                        </span>
                      </span>
                      <input
                        id="featuredImages"
                        {...register(`featuredImages.${index}`, {
                          validate: {
                            fileSize: (value: any) => {
                              if (
                                !(typeof value === "string") &&
                                value &&
                                value[0] &&
                                value[0].size > 1048576
                              ) {
                                return "File size must be less than 1MB";
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
                    {fields.length > 1 && (
                      <IconButton onClick={() => remove(index)}>
                        <Close />
                      </IconButton>
                    )}
                  </span>
                  {/* <span className="text-[10px] text-titleColor">
                  Image size must be 600*600 File size must be less than 1MB
                </span> */}
                </div>
              ))}
              <Button
                onClick={append}
                variant="outlined"
                className="border-gray-500 w-full text-gray-500 capitalize"
              >
                + Add Items
              </Button>
              <div className="flex flex-col gap-1 text-titleColor">
                <label>Youtube Link</label>
                <TextField
                  {...register("youtubeLink")}
                  variant="outlined"
                  error={Boolean(!!errors.youtubeLink)}
                  helperText={
                    !!errors.youtubeLink &&
                    errors.youtubeLink.message?.toString()
                  }
                  sx={{ backgroundColor: "white" }}
                  inputProps={{ style: { padding: 10 } }}
                />
              </div>
              <div className="flex flex-col gap-1 text-titleColor">
                <label>Body</label>
                <TextField
                  {...register("body", { required: "required" })}
                  variant="outlined"
                  multiline
                  rows={4}
                  error={Boolean(!!errors.body)}
                  helperText={!!errors.body && errors.body.message?.toString()}
                  sx={{ backgroundColor: "white" }}
                  inputProps={{ style: { padding: 0 } }}
                />
              </div>
              <div className="flex flex-col gap-1 text-titleColor">
                <label>Body in Amharic</label>
                <TextField
                  {...register("bodyAmharic", { required: "required" })}
                  variant="outlined"
                  multiline
                  rows={4}
                  error={Boolean(!!errors.bodyAmharic)}
                  helperText={
                    !!errors.bodyAmharic &&
                    errors.bodyAmharic.message?.toString()
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
                    <CircularProgress className="text-white" />
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

export default Initiatives;
