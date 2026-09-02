import Sidebar from "@/components/shared/sidebar/Sidebar";
import { OPTIONS } from "@/util/authOptions";
import { UserRole } from "@prisma/client";
import { getServerSession } from "next-auth";
import { redirect } from "next/navigation";

export default async function AdminLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const session = await getServerSession(OPTIONS);
  if (!session?.user?.id) {
    redirect("/daadmin/login");
  } else if (session?.user?.role === UserRole.Member) {
    redirect("/member/dashboard");
  }

  const menuItems = [
    {
      name: "Dashboard",
      link: "/admin/dashboard",
      activeIcon: "/icons/dashboardactive.svg",
      icon: "/icons/dashboard.svg",
      isAccessible: Boolean(session?.user?.role !== UserRole.Admin),
    },
    {
      name: "Members List",
      link: "/admin/dashboard/members",
      activeIcon: "/icons/membersactive.svg",
      icon: "/icons/members.svg",
      isAccessible: true,
    },
    {
      name: "General Donation",
      link: "/admin/dashboard/donations",
      activeIcon: "/icons/donationactive.svg",
      icon: "/icons/donation.svg",
      isAccessible: Boolean(session?.user?.role !== UserRole.Admin),
    },
    {
      name: "CMS",
      link: "/admin/dashboard/cms",
      activeIcon: "/icons/cmsactive.svg",
      icon: "/icons/cms.svg",
      isAccessible: Boolean(session?.user?.role !== UserRole.Admin),
    },
    {
      name: "Auction",
      link: "/admin/dashboard/auction",
      activeIcon: "/icons/auctionactive.svg",
      icon: "/icons/auction.svg",
      isAccessible: Boolean(session?.user?.role !== UserRole.Admin),
    },
    {
      name: "SMS",
      link: "/admin/dashboard/sms",
      activeIcon: "/icons/smsactive.svg",
      icon: "/icons/sms.svg",
      isAccessible: Boolean(session?.user?.role !== UserRole.Admin),
    },
    {
      name: "Membership Levels",
      link: "/admin/dashboard/membership-levels",
      activeIcon: "/icons/membershiplevelsactive.svg",
      icon: "/icons/membershiplevels.svg",
      isAccessible: Boolean(session?.user?.role !== UserRole.Admin),
    },
  ];

  return (
    <div className="flex flex-row h-screen w-screen relative">
      <Sidebar menuItems={menuItems} />
      <div className="flex-1 max-w-full bg-[#f5f5f5]">{children}</div>
    </div>
  );
}
