import { UserRole } from "@prisma/client";
import { getServerSession } from "next-auth";
import { OPTIONS } from "./authOptions";

// Staff (Owner/SuperAdmin/Admin) sessions can see draft CMS content;
// everyone else (members, anonymous visitors) only sees published content.
export async function isStaffSession(): Promise<boolean> {
  const session = await getServerSession(OPTIONS);
  const role = session?.user?.role;
  return Boolean(role && role !== UserRole.Member);
}
