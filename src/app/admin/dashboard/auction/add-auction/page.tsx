import AddNewAuction from "@/components/auctions/AddNewAuction";
import { UserRole } from "@prisma/client";
import { getServerSession } from "next-auth";
import { redirect } from "next/navigation";

export default async function AuctionPage() {
  const session = await getServerSession();
  if (session?.user.role !== UserRole.Owner) {
    redirect("/admin/dashboard/auction");
  }
  return <AddNewAuction />;
}
