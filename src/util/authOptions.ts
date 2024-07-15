import { NextAuthOptions, User } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import GoogleProvider from "next-auth/providers/google";
import bcrypt from "bcrypt";
import { findUserByEmail } from "@/db/user";
import { findMemberByPhone } from "@/db/member";
import { UserRole } from "@prisma/client";

interface SessionUser {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  role: UserRole;
  phone: string;
  profileImage: string;
}

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

        const user = await findUserByEmail(email);
        if (user) {
          const result = await comparePasswords(
            password,
            user?.password_hash ?? ""
          );

          if (result) {
            return {
              id: user.id,
              firstName: user.firstName,
              lastName: user.lastName,
              email: user.email,
              role: user.role as UserRole,
              phone: user.phone,
              profileImage: user.profilePic,
            } as SessionUser;
          } else {
            throw new Error("Username or password not correct");
          }
        } else {
          const member = await findMemberByPhone(email);

          if (member) {
            const result = await comparePasswords(
              password,
              member?.password_hash ?? ""
            );

            if (result) {
              return {
                id: member.id,
                firstName: member.firstName ?? "",
                lastName: member.lastName ?? "",
                email: member.email ?? "",
                role: UserRole.Member,
                phone: member.phone,
                profileImage: member.profileImage,
              } as SessionUser;
            } else {
              throw new Error("Phone or password not correct");
            }
          } else {
            throw new Error("User doesn't exist");
          }
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
        return Boolean(user.id && typeof user?.id === "string" && user.role);
      }
    },
    redirect({ baseUrl }) {
      return `${baseUrl}/login`;
    },
    session({ session, token }) {
      const authUser = token as unknown as SessionUser;

      session.user = {
        firstName: authUser.firstName,
        lastName: authUser.lastName,
        role: authUser.role,
        email: authUser.email,
        id: authUser.id,
        phone: authUser.phone,
        profileImage: authUser.profileImage,
      };
      return session;
    },
    async jwt({ token, account, user }) {
      if (user) {
        token.id = user.id;
        token.email = user.email;
        token.firstName = user.firstName;
        token.lastName = user.lastName;
        token.role = user.role;
        token.phone = user.phone;
        token.profileImage = user.profileImage;
      } else if (token.email) {
        const savedUser = await findUserByEmail(token.email);
        if (savedUser) {
          token.id = savedUser?.id;
          token.email = savedUser.email;
          token.firstName = savedUser.firstName;
          token.lastName = savedUser.lastName;
          token.role = savedUser.role;
          token.phone = savedUser.phone;
          token.profileImage = savedUser.profilePic;
        } else {
          // since we are getting the phone through the email field from frontend we pass token.email
          const savedMember = await findMemberByPhone(token.email);
          if (savedMember) {
            token.id = savedMember?.id;
            token.email = savedMember.email;
            token.firstName = savedMember.firstName
              ? savedMember.firstName
              : savedMember.institutionName;
            token.lastName = savedMember.lastName;
            token.role = UserRole.Member;
            token.phone = savedMember.phone;
            token.profileImage = savedMember.profileImage;
          }
        }
      }
      return token;
    },
  },
  secret: process.env.NEXTAUTH_SECRET,
  session: {
    strategy: "jwt",
    maxAge: 1 * 24 * 60 * 60, // Session will expire after 1 day.
    updateAge: 10 * 60, // 5 minutes to keep the session alive as long as the user is active.
  },
};
