"use client";

import { useState } from "react";
import Login from "./Login";
import SignUp from "./Signup";
import { useSession } from "next-auth/react";
import { redirect } from "next/navigation";

const Auth = () => {
  const session = useSession();
  const [isLogin, setIsLogin] = useState(true);

  if (session.data?.user?.role === "Member") {
    redirect("members/dashboard");
  } else if (session.data?.user?.id) {
    redirect("/admin/dashboard");
  }

  return (
    <div className="flex-1 flex flex-col items-center justify-center bg-white h-screen w-screen">
      <div>
        {isLogin ? <Login /> : <SignUp />}

        <div className="flex flex-row items-center w-full gap-2 mt-6 pl-2">
          <span>
            {isLogin ? "you don't have account?" : "have an account?"}
          </span>
          <span
            onClick={() => setIsLogin(!isLogin)}
            className="text-green-500 cursor-pointer"
          >
            {isLogin ? "Sign Up" : "Login"}
          </span>
        </div>
      </div>
    </div>
  );
};

export default Auth;
