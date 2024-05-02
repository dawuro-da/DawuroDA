import { UserRole } from "@prisma/client";
import "next-auth";

declare module "next-auth" {
  interface Session {
    user: {
      /** The user's id. */
      id: string;
      firstName: string;
      lastName: string;
      role: UserRole;
      email: string;
    };
  }

  interface User {
    id: string;
    firstName: string;
    lastName: string;
    role: UserRole;
    email: string;
  }
}
