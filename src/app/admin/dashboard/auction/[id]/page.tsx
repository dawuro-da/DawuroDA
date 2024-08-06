import AuctionDetail from "@/components/auctions/AuctionDetail";
import { findAuctionDetailById } from "@/db/auction";
import { UserRole } from "@prisma/client";
import { getServerSession } from "next-auth";
import { redirect } from "next/navigation";

const AuctionDetailPage = async ({ params }: { params: { id: string } }) => {
  const session = await getServerSession();
  if (!session?.user || session?.user.role === UserRole.Member) {
    redirect("/gaadmin/login");
  } else if (session?.user?.role === UserRole.Admin) {
    redirect("/admin/dashboard/members");
  }

  const auction = await findAuctionDetailById(params.id);

  return <AuctionDetail auction={auction} />;
};

export default AuctionDetailPage;
