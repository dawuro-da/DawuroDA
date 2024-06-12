import { showToastAction } from "@/redux/actions";
import {
  PanoramaFishEye,
  PasswordOutlined,
  RemoveRedEyeOutlined,
  RemoveRedEyeTwoTone,
} from "@mui/icons-material";
import {
  Button,
  CircularProgress,
  IconButton,
  MenuItem,
  TextField,
} from "@mui/material";
import { Gender, UserRole } from "@prisma/client";
import axios from "axios";
import { signIn } from "next-auth/react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { FieldValues, useForm } from "react-hook-form";
import { useDispatch } from "react-redux";

const SignUp = () => {
  const router = useRouter();
  const dispatch = useDispatch();
  const [signupError, setSignUpError] = useState<string>("");
  const [loading, setLoading] = useState<boolean>(false);
  const [showPassword, setShowPassword] = useState<boolean>(false);
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm();

  const handleRegister = async (values: FieldValues) => {
    const { firstName, lastName, gender, email, phone, password } = values;
    setLoading(true);
    try {
      const res = await axios.post("/api/user/signup/", {
        firstName,
        lastName,
        role: UserRole.SuperAdmin,
        gender,
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
      await setSignUpError(err?.response?.data?.error);
      dispatch(showToastAction({ message: signupError, type: "error" }));
    }
    setLoading(false);
  };

  return (
    <div>
      <form
        onSubmit={handleSubmit(handleRegister)}
        className=" flex flex-col gap-4 my-2 min-w-[300px]"
      >
        <div className="flex flex-col gap-2 w-full items-center mb-2">
          <span className="font-extrabold text-3xl text-green-500 ">
            Sign Up
          </span>
          <span className="mb-6">
            {"Welcome, It's great getting you as a user"}
          </span>
        </div>

        <div className="flex flex-col items-center justify-center">
          <div className="grid xl:grid-cols-2 lg:grid-cols-2 md:grid-cols-2 gap-6 ">
            <div className="flex flex-col gap-2 text-[#555555] h-full w-[300px]">
              <label>First Name</label>
              <TextField
                {...register("firstName", {
                  required: "First Name is required",
                })}
                variant="outlined"
                error={Boolean(!!errors.firstName)}
                helperText={
                  !!errors.firstName && errors.firstName.message?.toString()
                }
                inputProps={{
                  style: {
                    padding: 10,
                    borderRadius: "6px",
                  },
                }}
              />
            </div>
            <div className="flex flex-col gap-2 text-[#555555] h-full w-[300px]">
              <label>Last Name</label>
              <TextField
                {...register("lastName", { required: "Last Name is required" })}
                variant="outlined"
                error={Boolean(!!errors.lastName)}
                helperText={
                  !!errors.lastName && errors.lastName.message?.toString()
                }
                inputProps={{
                  style: {
                    padding: 10,
                    borderRadius: "6px",
                  },
                }}
              />
            </div>
            <div className="flex flex-col gap-2 text-[#555555] h-full w-[300px]">
              <label>Phone Number</label>
              <TextField
                {...register("phone", { required: "Phone is required" })}
                variant="outlined"
                error={Boolean(!!errors.phone)}
                helperText={!!errors.phone && errors.phone.message?.toString()}
                inputProps={{
                  style: {
                    padding: 10,
                    borderRadius: "6px",
                  },
                }}
              />
            </div>
            <div className="flex flex-col gap-2 text-[#555555] h-full w-[300px]">
              <label>Email Address</label>
              <TextField
                {...register("email", { required: "Email is required" })}
                variant="outlined"
                error={Boolean(!!errors.email)}
                helperText={!!errors.email && errors.email.message?.toString()}
                inputProps={{
                  style: {
                    padding: 10,
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
                variant="outlined"
                error={Boolean(!!errors.gender)}
                helperText={
                  !!errors.gender && errors.gender.message?.toString()
                }
                inputProps={{
                  style: {
                    padding: 10,
                    borderRadius: "6px",
                  },
                }}
              >
                <MenuItem value={Gender.Male}>Male</MenuItem>
                <MenuItem value={Gender.Female}>Female</MenuItem>
              </TextField>
            </div>
            <div className="flex flex-col gap-[7px] text-[#555555] h-full w-[300px]">
              <label className="flex flex-row items-center justify-between">
                <span>Password</span>

                {showPassword ? (
                  <Image
                    onClick={() => setShowPassword(!showPassword)}
                    src={"/icons/hideEye.svg"}
                    alt=""
                    className="cursor-pointer"
                    height={20}
                    width={20}
                  />
                ) : (
                  <RemoveRedEyeOutlined
                    onClick={() => setShowPassword(!showPassword)}
                    className="cursor-pointer"
                    style={{ height: 20, width: 20 }}
                  />
                )}
              </label>
              <TextField
                {...register("password", { required: "Password is required" })}
                variant="outlined"
                type={showPassword ? "text" : "password"}
                error={Boolean(!!errors.password)}
                helperText={
                  !!errors.password && errors.password.message?.toString()
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
          <Button
            type="submit"
            className="bg-primaryColor w-full mt-10 text-white hover:bg-primaryColor border-2 rounded-[16px] p-3 h-[48px]"
          >
            {loading ? (
              <CircularProgress style={{ color: "white" }} />
            ) : (
              "Register"
            )}
          </Button>
        </div>
      </form>
    </div>
  );
};

export default SignUp;
