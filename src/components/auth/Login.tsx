import { Button, CircularProgress, TextField } from "@mui/material";
import { signIn } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { FieldValues, useForm } from "react-hook-form";

const Login = () => {
  const router = useRouter();
  const [loginError, setLoginError] = useState<string>("");
  const [loading, setLoading] = useState<boolean>(false);
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm();

  const handleLogin = async (values: FieldValues) => {
    const { email, password } = values;
    setLoading(true);
    const res = await signIn("credentials", {
      email,
      password,
      redirect: false,
    });

    if (res?.status === 200) {
      router.push("/admin/dashboard");
    } else if (res?.status === 401) {
      setLoginError(res.error ?? "Login Error");
    }
    setLoading(false);
  };

  return (
    <div>
      <form
        onSubmit={handleSubmit(handleLogin)}
        className=" flex flex-col  my-2 min-w-[300px]"
      >
        <div className="flex flex-col gap-2 w-full items-center mb-2">
          <span className="font-extrabold text-3xl text-green-500 ">
            Gammoda
          </span>
          <span className="">Welcome back</span>
        </div>

        <TextField
          size="small"
          {...register("email", { required: "Email is required" })}
          type="email"
          className="border-2 rounded-[16px] p-2"
          sx={{ backgroundColor: "white" }}
          inputProps={{ style: { padding: 10 } }}
        />
        <TextField
          size="small"
          {...register("password", { required: "password is required" })}
          type="password"
          className="border-2 rounded-[16px] p-2"
        />
        <span className="my-2 text-red-500 px-3">
          {errors.email?.message
            ? errors.email?.message.toString()
            : errors.password?.message
            ? errors.password?.message.toString()
            : loginError
            ? loginError
            : ""}
        </span>
        <span className="w-full text-right py-2 hover:underline cursor-pointer">
          Forgot Password?
        </span>
        <Button
          type="submit"
          className="bg-green-500 text-white hover:bg-green-500 border-2 rounded-[16px] p-3 h-[48px]"
        >
          {loading ? <CircularProgress style={{ color: "white" }} /> : "Login"}
        </Button>
      </form>
    </div>
  );
};

export default Login;
