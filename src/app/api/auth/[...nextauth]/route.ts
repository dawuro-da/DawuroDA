// pages/api/auth/[...nextauth].ts

import { NextApiHandler } from "next";
import NextAuth, { NextAuthOptions, User } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import GoogleProvider from "next-auth/providers/google";
import bcrypt from "bcrypt";
import { findByEmail } from "@/db/user";

const comparePasswords = async (
  password: string,
  hashedPassword: string
): Promise<boolean> => {
  try {
    const result = await bcrypt.compare(password, hashedPassword);
    return result;
  } catch (err) {
    throw new Error("Error comparing passwords");
  }
};

export const OPTIONS: NextAuthOptions = {
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_ID ?? "",
      clientSecret: process.env.GOOGLE_SECRET ?? "",
    }),
    CredentialsProvider({
      name: "Credentials",
      credentials: {},
      async authorize(credentials) {
        if (!credentials) {
          return null;
        }
        const { email, password } = credentials as {
          email: string;
          password: string;
        };

        const user = await findByEmail(email);
        if (user) {
          const result = await comparePasswords(
            password,
            user?.password_hash ?? ""
          );

          if (result) {
            return user;
          } else {
            throw Error("Username or password not correct");
          }
        } else {
          throw Error("User doesn't Exist");
        }
      },
    }),
  ],
  pages: {
    signIn: "/login",
  },
  callbacks: {
    signIn({ user, account }) {
      if (account?.provider === "google") {
        return true;
      } else {
        return Boolean(
          user.id &&
            typeof user.id === "string" &&
            user.email &&
            user.firstName &&
            user.role &&
            user.lastName
        );
      }
    },
    redirect({ baseUrl }) {
      return `${baseUrl}/login`;
    },
    session({ session, token }) {
      const authUser = token as unknown as User;
      session.user = {
        firstName: authUser.firstName,
        lastName: authUser.lastName,
        role: authUser.role,
        email: authUser.email,
        id: authUser?.id,
      };
      return session;
    },
    async jwt({ token, account, user }) {
      if (!token.email) {
        return token;
      }

      const savedUser = await findByEmail(token.email);

      if (savedUser) {
        token.id = savedUser.id;
        token.email = savedUser.email;
        token.firstName = savedUser.firstName;
        token.lastName = savedUser.lastName;
        token.role = savedUser.role;
      }

      return token;
    },
  },
  secret: process.env.NEXTAUTH_SECRET,
  session: {
    strategy: "jwt",
    maxAge: 30 * 24 * 60 * 60, //session will expire after 30 days of inactivity.
    updateAge: 24 * 60 * 60, //24 hours  keeps the session alive as long as the user is active.
  },
};
const authHandler: NextApiHandler = (req, res) => NextAuth(req, res, OPTIONS);

export { authHandler as GET, authHandler as POST };
