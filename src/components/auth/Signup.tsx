import { Button, CircularProgress, MenuItem, TextField } from "@mui/material";
import { Gender, UserRole } from "@prisma/client";
import axios from "axios";
import { signIn } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { FieldValues, useForm } from "react-hook-form";

const SignUp = () => {
  const router = useRouter();
  const [signupError, setSignUpError] = useState<string>("");
  const [loading, setLoading] = useState<boolean>(false);
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm();

  const handleRegister = async (values: FieldValues) => {
    const { firstName, lastName, gender, userName, email, phone, password } =
      values;
    setLoading(true);
    try {
      const res = await axios.post("/api/user/register/", {
        firstName,
        lastName,
        role: UserRole.SuperAdmin,
        gender,
        userName,
        email,
        phone,
        password,
      });

      if (res.status === 200 && res.data.success) {
        const res = await signIn("credentials", {
          email,
          password,
          redirect: false,
        });

        if (res?.status === 200) {
          router.push("/admin/dashboard");
        } else if (res?.status === 401) {
          setSignUpError(res.error ?? "SignUp Error");
        }
      }
    } catch (err: any) {
      console.error(err);
      setSignUpError(err?.response?.data?.error);
    }
    setLoading(false);
  };

  return (
    <div>
      <form
        onSubmit={handleSubmit(handleRegister)}
        className="text-fadeTextColor flex flex-col gap-4 my-2 min-w-[300px]"
      >
        <div className="flex flex-col gap-2 w-full items-center mb-2">
          <span className="font-extrabold text-3xl text-green-500 ">
            Sign Up
          </span>
          <span className="mb-6">
            Welcome, It's great getting you as a user
          </span>
        </div>

        <div className="grid grid-cols-2">
          <TextField
            size="small"
            {...register("firstName", { required: "First name is required" })}
            type="text"
            placeholder="First Name"
            className="border-2 rounded-[16px] p-2"
            sx={{ backgroundColor: "white" }}
            inputProps={{ style: { padding: 10 } }}
          />
          <TextField
            size="small"
            {...register("lastName", { required: "Last name is required" })}
            type="text"
            placeholder="Last Name"
            className="border-2 rounded-[16px] p-2"
            sx={{ backgroundColor: "white" }}
            inputProps={{ style: { padding: 10 } }}
          />
          <TextField
            size="small"
            {...register("userName", { required: "userName is required" })}
            type="text"
            placeholder="Username"
            className="border-2 rounded-[16px] p-2"
            sx={{ backgroundColor: "white" }}
            inputProps={{ style: { padding: 10 } }}
          />
          <TextField
            size="small"
            {...register("gender", {
              required: "Gender is required",
            })}
            select
            className="border-2 rounded-[16px] p-2"
            sx={{ backgroundColor: "white" }}
            inputProps={{ style: { padding: 12 } }}
          >
            <MenuItem value={Gender.Male}>Male</MenuItem>
            <MenuItem value={Gender.Female}>Female</MenuItem>
          </TextField>

          <TextField
            size="small"
            {...register("phone")}
            type="text"
            placeholder="phone number (optional)"
            className="border-2 rounded-[16px] p-2"
            sx={{ backgroundColor: "white" }}
            inputProps={{ style: { padding: 10 } }}
          />
          <TextField
            size="small"
            {...register("email", { required: "Email is required" })}
            type="email"
            placeholder="email"
            className="border-2 rounded-[16px] p-2"
            sx={{ backgroundColor: "white" }}
            inputProps={{ style: { padding: 10 } }}
          />
          <TextField
            size="small"
            {...register("password", { required: "password is required" })}
            type="password"
            placeholder="password"
            className="border-2 rounded-[16px] p-2"
            sx={{ backgroundColor: "white" }}
            inputProps={{ style: { padding: 10 } }}
          />
        </div>
        <span className="my-2 text-red-500 px-3">
          {errors.name?.message
            ? errors.name?.message.toString()
            : errors.email?.message
            ? errors.email?.message.toString()
            : errors.password?.message
            ? errors.password?.message.toString()
            : signupError
            ? signupError
            : ""}
        </span>
        <Button
          type="submit"
          className="bg-green-500 text-white hover:bg-green-500 border-2 rounded-[16px] p-3 h-[48px]"
        >
          {loading ? (
            <CircularProgress style={{ color: "white" }} />
          ) : (
            "Register"
          )}
        </Button>
      </form>
    </div>
  );
};

export default SignUp;
