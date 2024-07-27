import Auction from "@/components/auctions/Auction";
import { OPTIONS } from "@/util/authOptions";
import { UserRole } from "@prisma/client";
import { getServerSession } from "next-auth";
import { redirect } from "next/navigation";

export default async function AuctionPage() {
  const session = await getServerSession(OPTIONS);

  if (!session?.user?.id || session?.user?.role === UserRole.Member) {
    redirect("/gaadmin/login");
  } else if (session?.user?.role === UserRole.Admin) {
    redirect("/admin/dashboard/members");
  }

  return <Auction />;
}
