"use client";

import { useState } from "react";
import { Button, CircularProgress, TextField } from "@mui/material";
import { useRouter } from "next/navigation";
import { FieldValues, useForm } from "react-hook-form";
import axios from "axios";
import { useDispatch } from "react-redux";
import { showToastAction } from "@/redux/actions";

const AdminForgotPassword = () => {
  const router = useRouter();
  const dispatch = useDispatch();
  const [forgotError, setforgotError] = useState<string>("");
  const [loading, setLoading] = useState<boolean>(false);
  const [isSuccessfull, setIsSuccessfull] = useState<boolean>(false);
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm();

  const handleForgot = async (values: FieldValues) => {
    const { email } = values;
    try {
      setLoading(true);
      const res = await axios.post("/api/user/forgot-password", { email });
      if (res.data.success && res.status === 200) {
        setIsSuccessfull(true);
      } else {
        dispatch(showToastAction({ message: res.data.error, type: "error" }));
      }
    } catch (err: any) {
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
    <div className="flex-1 flex flex-col items-center justify-center bg-white h-screen w-screen px-6">
      <div>
        <div>
          <form
            onSubmit={handleSubmit(handleForgot)}
            className=" flex flex-col gap-2 my-2 w-full max-w-[300px]"
          >
            <div className="flex flex-col gap-2 w-full  mb-6">
              <span className="font-extrabold text-3xl text-primaryColor ">
                Forgot Password
              </span>
              <small className="text-titleColor max-w-[400px]">
                {`Please enter your email address and you will recieve an email.
                and please don't share your email with anyone.`}
              </small>
            </div>

            <div className="flex flex-col gap-4">
              <div className="flex flex-col gap-[7px] text-[#555555] h-full ">
                <span>Email</span>

                <TextField
                  {...register("email", {
                    required: "email is required",
                  })}
                  variant="outlined"
                  error={Boolean(!!errors.email)}
                  helperText={
                    !!errors.email && errors.email.message?.toString()
                  }
                  inputProps={{
                    style: {
                      padding: 9,
                      borderRadius: "6px",
                    },
                  }}
                />
              </div>
            </div>
            <span className="my-2 text-red-500 px-3">
              {forgotError ? forgotError : ""}
            </span>
            {isSuccessfull && (
              <span className="text-primaryColor text-xl">
                Successfully Sent
              </span>
            )}
            <Button
              variant="contained"
              type="submit"
              disabled={isSuccessfull}
              className="bg-primaryColor shadow-none text-white hover:bg-primaryColor border-2 rounded-[16px] p-3 h-[48px]"
            >
              {loading ? (
                <CircularProgress style={{ color: "white" }} />
              ) : (
                "Send Email"
              )}
            </Button>
            <div className="flex flex-row items-center gap-2 mt-2">
              <span
                onClick={() => router.push("/daadmin/login")}
                className="text-green-500 cursor-pointer"
              >
                {"Back to Login"}
              </span>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default AdminForgotPassword;
