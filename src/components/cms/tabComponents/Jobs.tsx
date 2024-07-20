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
import { Job } from "@prisma/client";
import axios from "axios";
import Image from "next/image";
import { useEffect, useState } from "react";
import { FieldValues, useForm } from "react-hook-form";
import { useDispatch } from "react-redux";
import JobEdit from "./JobsEdit";

const Jobs = () => {
  const dispatch = useDispatch();
  const [refetch, setRefetch] = useState<boolean>(false);
  const [loading, setLoading] = useState<boolean>(false);
  const [fetchLoading, setfetchLoading] = useState<boolean>(false);
  const [searchText, setSearchText] = useState<string>("");
  const [jobs, setJobs] = useState<Job[]>();
  const [totalCount, setTotalCount] = useState<number>(0);
  const [selectedJob, setSelectedJob] = useState<Job>();
  const [createJobForm, setCreateJobForm] = useState(false);
  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
    watch,
  } = useForm();

  const fetchjob = async ({ page, pageSize }: PageState) => {
    setfetchLoading(true);
    const result = await axios.post("/api/cms/job/fetch", {
      page,
      pageSize,
      searchText,
    });

    if (result.data.success) {
      setJobs(result.data.value.jobs);
      setTotalCount(result.data.value.total);
    }
    setfetchLoading(false);
  };

  useEffect(() => {
    fetchjob({ page: 1, pageSize: 30 });
  }, [refetch]);

  useEffect(() => {}, [selectedJob]);

  const handleRegister = async (values: FieldValues) => {
    setLoading(true);
    try {
      const res = await axios.post("/api/cms/job/create", {
        ...values,
        profileImage: "/mike/new",
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
            <span className="font-bold text-xl">Jobs</span>
            <span className="flex flex-rwo items-center gap-2">
              <Image
                src={"/icons/bx_edit.svg"}
                alt=""
                width={20}
                height={20}
                className="cursor-pointer"
                onClick={() => {
                  setSelectedJob(undefined);
                  setCreateJobForm(true);
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
            jobs?.map((item, index) => {
              return (
                <div
                  key={item.id}
                  onClick={() => setSelectedJob(item)}
                  className={`relative w-full h-[50px] flex flex-row items-center ${
                    selectedJob?.id === item.id && "bg-[#e5e5e6]"
                  } gap-2 hover:bg-[#e5e5e6] cursor-pointer`}
                >
                  {/* <Image
                    src={"/icons/list.png"}
                    alt=""
                    height={50}
                    width={50}
                    className="h-full"
                  /> */}
                  <span className=" overflow-clip text-ellipsis text-nowrap flex-1 max-w-[70%]">
                    {item.jobTitle}
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
      {selectedJob ? (
        <JobEdit
          selectedJob={selectedJob}
          refetch={refetch}
          setRefetch={setRefetch}
          setSelectedJob={setSelectedJob}
        />
      ) : createJobForm ? (
        <div className="min-w-[350px] border-[1px] border-[#d1d1d1] gap-4 flex-1 overflow-y-auto h-full hiddenscrollbar">
          <div className="h-[139px] w-full border-b-[1px] border-[#d1d1d1] lg:pr-[40px] md:pr-[40px] pr-[20px] pl-6 flex flex-row items-center"></div>
          <form
            onSubmit={handleSubmit(handleRegister)}
            className="relative flex-1 flex flex-col h-full p-10"
          >
            <div className="flex flex-col gap-4 text-titleColor h-full">
              <label>Job Title</label>
              <TextField
                {...register("jobTitle", { required: "required" })}
                variant="outlined"
                error={Boolean(!!errors.jobTitle)}
                helperText={
                  !!errors.jobTitle && errors.jobTitle.message?.toString()
                }
                sx={{ backgroundColor: "white" }}
                inputProps={{ style: { padding: 10 } }}
              />
              <div className="flex flex-col gap-1 text-titleColor">
                <label>Job Title in Amharic</label>
                <TextField
                  {...register("jobTitleAmharic", { required: "required" })}
                  variant="outlined"
                  error={Boolean(!!errors.jobTitleAmharic)}
                  helperText={
                    !!errors.jobTitleAmharic &&
                    errors.jobTitleAmharic.message?.toString()
                  }
                  sx={{ backgroundColor: "white" }}
                  inputProps={{ style: { padding: 10 } }}
                />
              </div>

              <div className="flex flex-col gap-1 text-titleColor">
                <label>Job Description</label>
                <TextField
                  {...register("jobDescription", { required: "required" })}
                  variant="outlined"
                  multiline
                  rows={4}
                  error={Boolean(!!errors.jobDescription)}
                  helperText={
                    !!errors.jobDescription &&
                    errors.jobDescription.message?.toString()
                  }
                  sx={{ backgroundColor: "white" }}
                  inputProps={{ style: { padding: 0 } }}
                />
              </div>
              <div className="flex flex-col gap-1 text-titleColor">
                <label>Job Description in Amharic</label>
                <TextField
                  {...register("jobDescriptionAmharic", {
                    required: "required",
                  })}
                  variant="outlined"
                  multiline
                  rows={4}
                  error={Boolean(!!errors.jobDescriptionAmharic)}
                  helperText={
                    !!errors.jobDescriptionAmharic &&
                    errors.jobDescriptionAmharic.message?.toString()
                  }
                  sx={{ backgroundColor: "white" }}
                  inputProps={{ style: { padding: 0 } }}
                />
              </div>
              <div className="flex flex-col gap-1 text-titleColor">
                <label>Responsiblities</label>
                <TextField
                  {...register("responsiblities", { required: "required" })}
                  variant="outlined"
                  multiline
                  rows={4}
                  error={Boolean(!!errors.responsiblities)}
                  helperText={
                    !!errors.responsiblities &&
                    errors.responsiblities.message?.toString()
                  }
                  sx={{ backgroundColor: "white" }}
                  inputProps={{ style: { padding: 0 } }}
                />
              </div>
              <div className="flex flex-col gap-1 text-titleColor">
                <label>Qualification</label>
                <TextField
                  {...register("qualification", { required: "required" })}
                  variant="outlined"
                  multiline
                  rows={4}
                  error={Boolean(!!errors.qualification)}
                  helperText={
                    !!errors.qualification &&
                    errors.qualification.message?.toString()
                  }
                  sx={{ backgroundColor: "white" }}
                  inputProps={{ style: { padding: 0 } }}
                />
              </div>
              <div className="flex flex-col gap-1 text-titleColor">
                <label>Benefits</label>
                <TextField
                  {...register("benefits", { required: "required" })}
                  variant="outlined"
                  multiline
                  rows={4}
                  error={Boolean(!!errors.benefits)}
                  helperText={
                    !!errors.benefits && errors.benefits.message?.toString()
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

export default Jobs;
