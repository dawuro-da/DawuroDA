"use client";

import { useState } from "react";
import Login from "./Login";
import SignUp from "./Signup";

const Auth = () => {
  const [isLogin, setIsLogin] = useState(true);

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
