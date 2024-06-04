import { showToastAction } from "@/redux/actions";
import { Recycling, RecyclingOutlined } from "@mui/icons-material";
import {
  Avatar,
  Button,
  CircularProgress,
  MenuItem,
  TextField,
} from "@mui/material";
import { Gender, User } from "@prisma/client";
import axios from "axios";
import Image from "next/image";
import { useState } from "react";
import { FieldValues, useForm } from "react-hook-form";
import { useDispatch } from "react-redux";

const ProfileManagement = ({ user }: { user: User | null }) => {
  const dispatch = useDispatch();
  const [loading, setLoading] = useState(false);
  const {
    register,
    handleSubmit,
    formState: { errors },
    watch,
  } = useForm({ defaultValues: { ...user } });

  const handleUpdate = async (values: FieldValues) => {
    setLoading(true);
    try {
      const res = await axios.post(`/api/user/edit/${user?.id}`, {
        ...values,
      });

      if (res?.status === 200) {
        dispatch(
          showToastAction({
            message: "Successfully Updated",
            type: "success",
          })
        );
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
    <div className="flex flex-col items-center justify-center mt-5">
      <form
        onSubmit={handleSubmit(handleUpdate)}
        className="flex flex-col items-center justify-center gap-8"
      >
        <div className="relative w-fit h-fit">
          <Avatar src="/icons/list.png" style={{ width: 100, height: 100 }} />
          <Image
            className="absolute bottom-0 right-0 cursor-pointer"
            src="/icons/uploadCamera.svg"
            alt=""
            height={30}
            width={30}
          />
        </div>
        <div className="flex flex-col items-center">
          <span className="flex flex-row items-center justify-center gap-2 text-[#555555] font-bold text-2xl capitalize">
            <span>{user?.firstName}</span>
            <span>{user?.lastName}</span>
          </span>
          <span className="font-bold capitalize text-[#555555]">
            {user?.role}
          </span>
        </div>
        <div className="grid xl:grid-cols-2 lg:grid-cols-2 md:grid-cols-2 gap-6 ">
          <div className="flex flex-col gap-2 text-[#555555] h-full w-[300px]">
            <label>First Name</label>
            <TextField
              {...register("firstName")}
              variant="outlined"
              error={Boolean(!!errors.firstName)}
              helperText={
                !!errors.firstName && errors.firstName.message?.toString()
              }
              inputProps={{
                style: {
                  padding: 10,
                  border: "1px solid #BFE1CA",
                  backgroundColor: "#BFE1CA",
                  borderRadius: "6px",
                },
              }}
            />
          </div>
          <div className="flex flex-col gap-2 text-[#555555] h-full w-[300px]">
            <label>Last Name</label>
            <TextField
              {...register("lastName")}
              variant="outlined"
              error={Boolean(!!errors.lastName)}
              helperText={
                !!errors.lastName && errors.lastName.message?.toString()
              }
              inputProps={{
                style: {
                  padding: 10,
                  border: "1px solid #BFE1CA",
                  backgroundColor: "#BFE1CA",
                  borderRadius: "6px",
                },
              }}
            />
          </div>
          <div className="flex flex-col gap-2 text-[#555555] h-full w-[300px]">
            <label>Phone Number</label>
            <TextField
              {...register("phone")}
              variant="outlined"
              error={Boolean(!!errors.phone)}
              helperText={!!errors.phone && errors.phone.message?.toString()}
              inputProps={{
                style: {
                  padding: 10,
                  border: "1px solid #BFE1CA",
                  backgroundColor: "#BFE1CA",
                  borderRadius: "6px",
                },
              }}
            />
          </div>
          <div className="flex flex-col gap-2 text-[#555555] h-full w-[300px]">
            <label>Email Address</label>
            <TextField
              {...register("email")}
              variant="outlined"
              error={Boolean(!!errors.email)}
              helperText={!!errors.email && errors.email.message?.toString()}
              inputProps={{
                style: {
                  padding: 10,
                  border: "1px solid #BFE1CA",
                  backgroundColor: "#BFE1CA",
                  borderRadius: "6px",
                },
              }}
            />
          </div>
          <div className="flex flex-col gap-2 text-[#555555] h-full w-[300px]">
            <label>Gender</label>
            <TextField
              size="small"
              {...register("gender", {
                required: "Gender is required",
              })}
              select
              defaultValue={watch("gender")}
              variant="outlined"
              error={Boolean(!!errors.email)}
              helperText={!!errors.email && errors.email.message?.toString()}
              inputProps={{
                style: {
                  padding: 10,
                  border: "1px solid #BFE1CA",
                  backgroundColor: "#BFE1CA",
                  borderRadius: "6px",
                },
              }}
              sx={{ backgroundColor: "#BFE1CA", borderRadius: "6px" }}
            >
              <MenuItem value={Gender.Male}>Male</MenuItem>
              <MenuItem value={Gender.Female}>Female</MenuItem>
            </TextField>
          </div>
        </div>
        <Button
          type="submit"
          variant="contained"
          className="gap-2 font-bold h-[40px] text-lg mt-6 text-white capitalize p-2 bg-primaryColor shadow-none px-10"
        >
          {loading ? (
            <CircularProgress className="h-[90%]" />
          ) : (
            <>
              {" "}
              <Image src={"/icons/recycle.svg"} alt="" width={20} height={20} />
              Update
            </>
          )}
        </Button>
      </form>
    </div>
  );
};

export default ProfileManagement;
