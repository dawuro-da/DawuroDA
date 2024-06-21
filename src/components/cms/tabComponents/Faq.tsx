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
import { Faq } from "@prisma/client";
import axios from "axios";
import Image from "next/image";
import { useEffect, useState } from "react";
import { FieldValues, useForm } from "react-hook-form";
import { useDispatch } from "react-redux";
import FaqEdit from "./FaqEdit";

const FaqPage = () => {
  const dispatch = useDispatch();
  const [refetch, setRefetch] = useState<boolean>(false);
  const [loading, setLoading] = useState<boolean>(false);
  const [fetchLoading, setfetchLoading] = useState<boolean>(false);
  const [searchText, setSearchText] = useState<string>("");
  const [faqs, setFaqs] = useState<Faq[]>();
  const [totalCount, setTotalCount] = useState<number>(0);
  const [selectedFaq, setSelectedFaq] = useState<Faq>();
  const [createFaqForm, setCreateFaqForm] = useState(false);
  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
    watch,
  } = useForm();

  const fetchFaq = async ({ page, pageSize }: PageState) => {
    setfetchLoading(true);
    const result = await axios.post("/api/cms/faq/fetch", {
      page,
      pageSize,
      searchText,
    });

    if (result.data.success) {
      setFaqs(result.data.value.faqs);
      setTotalCount(result.data.value.total);
    }
    setfetchLoading(false);
  };

  useEffect(() => {
    fetchFaq({ page: 1, pageSize: 30 });
  }, [refetch]);

  useEffect(() => {}, [selectedFaq]);

  const handleRegister = async (values: FieldValues) => {
    setLoading(true);
    try {
      const res = await axios.post("/api/cms/faq/create", {
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
            <span className="font-bold text-xl">Faq</span>
            <span className="flex flex-rwo items-center gap-2">
              <Image
                src={"/icons/bx_edit.svg"}
                alt=""
                width={20}
                height={20}
                className="cursor-pointer"
                onClick={() => {
                  setSelectedFaq(undefined);
                  setCreateFaqForm(true);
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
        <div className="flex-1 px-4 mt-6 flex flex-col gap-4">
          {fetchLoading ? (
            <CircularProgress />
          ) : (
            faqs?.map((item, index) => {
              return (
                <div
                  key={item.id}
                  onClick={() => setSelectedFaq(item)}
                  className={`relative w-full h-[50px] flex flex-row items-center ${
                    selectedFaq?.id === item.id && "bg-[#e5e5e6]"
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
                    {item.question}
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
      {selectedFaq ? (
        <FaqEdit
          selectedFaq={selectedFaq}
          refetch={refetch}
          setRefetch={setRefetch}
          setSelectedFaq={setSelectedFaq}
        />
      ) : createFaqForm ? (
        <div className="min-w-[350px] border-[1px] border-[#d1d1d1] gap-4 flex-1 overflow-y-auto h-full hiddenscrollbar">
          <div className="h-[139px] w-full border-b-[1px] border-[#d1d1d1] lg:pr-[40px] md:pr-[40px] pr-[20px] pl-6 flex flex-row items-center"></div>
          <form
            onSubmit={handleSubmit(handleRegister)}
            className="relative flex-1 flex flex-col h-full max-h-[800px] p-10"
          >
            <div className="flex flex-col gap-4 text-titleColor h-full">
              <label>Question</label>
              <TextField
                {...register("question")}
                variant="outlined"
                error={Boolean(!!errors.question)}
                helperText={
                  !!errors.question && errors.question.message?.toString()
                }
                sx={{ backgroundColor: "white" }}
                inputProps={{ style: { padding: 10 } }}
              />
              <div className="flex flex-col gap-1 text-titleColor">
                <label>Answer</label>
                <TextField
                  {...register("answer")}
                  variant="outlined"
                  error={Boolean(!!errors.answer)}
                  helperText={
                    !!errors.answer && errors.answer.message?.toString()
                  }
                  sx={{ backgroundColor: "white" }}
                  inputProps={{ style: { padding: 10 } }}
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

export default FaqPage;
