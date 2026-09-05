import { NextAuthOptions, User } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import GoogleProvider from "next-auth/providers/google";
import bcrypt from "bcrypt";
import { findUserByEmail, findUserById } from "@/db/user";
import {
  findMemberByPhone,
  findMemberByEmail,
  findMemberById,
} from "@/db/member";
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
          const member =
            (await findMemberByPhone(email)) ?? (await findMemberByEmail(email));

          if (member) {
            const result = await comparePasswords(
              password,
              member?.password_hash ?? ""
            );

            if (result) {
              // A Member row exists as soon as the signup form is submitted
              // (see /api/tempMember/register) but stays hasPaid: false
              // until Chapa's webhook confirms payment or an admin approves
              // a submitted bank-transfer receipt — don't let them into the
              // dashboard before that.
              if (!member.hasPaid) {
                throw new Error(
                  "Your registration payment hasn't been confirmed yet. Please complete your payment, or wait for an admin to approve your submitted receipt, before logging in."
                );
              }
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
    redirect({ url, baseUrl }) {
      if (url.startsWith(`${baseUrl}/admin/`)) {
        return `${baseUrl}/daadmin/login`;
      } else {
        return `${baseUrl}/login`;
      }
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
      } else if (token.id) {
        // Refresh strictly within the account's own table, keyed by id —
        // never by email. Members and staff live in two separate tables
        // with no relation between them, but a member can freely edit
        // their own email. Refreshing-by-email used to look the token's
        // email up against the *staff* users table first: if a member's
        // email happened to match any staff account's email (by accident,
        // or deliberately, since email isn't a locked field), this
        // silently swapped their session — role included — for that staff
        // account's, with no password needed. ids never collide across
        // the two tables, so keying the refresh on id and staying within
        // the table implied by the token's own role closes that off.
        if (token.role === UserRole.Member) {
          const savedMember = await findMemberById(token.id as string);
          if (savedMember) {
            token.email = savedMember.email ?? "";
            token.firstName = savedMember.firstName
              ? savedMember.firstName
              : savedMember.institutionName ?? "";
            token.lastName = savedMember.lastName ?? "";
            token.phone = savedMember.phone;
            token.profileImage = savedMember.profileImage;
          }
        } else {
          const savedUser = await findUserById(token.id as string);
          if (savedUser) {
            token.email = savedUser.email;
            token.firstName = savedUser.firstName;
            token.lastName = savedUser.lastName;
            token.role = savedUser.role;
            token.phone = savedUser.phone;
            token.profileImage = savedUser.profilePic;
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
    updateAge: 10 * 60, // 10 minutes to keep the session alive as long as the user is active.
  },
};
