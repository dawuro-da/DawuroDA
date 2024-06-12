// pages/api/auth/[...nextauth].ts

import { OPTIONS } from "@/util/authOptions";
import NextAuth from "next-auth";

const authHandler = NextAuth(OPTIONS);

export { authHandler as GET, authHandler as POST };
