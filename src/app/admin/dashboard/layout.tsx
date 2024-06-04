import { OPTIONS } from "@/app/api/auth/[...nextauth]/route";
import Sidebar from "@/components/shared/sidebar/Sidebar";
import { UserRole } from "@prisma/client";
import { getServerSession } from "next-auth";
import { redirect } from "next/navigation";

export default async function AdminLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const session = await getServerSession(OPTIONS);
  if (!session?.user.id || session?.user?.role===UserRole.Member) {
    redirect("/login");
  }

  return (
    <div className="flex flex-row h-screen w-screen relative">
      <Sidebar />
      <div className="flex-1 max-w-full bg-[#f5f5f5]">{children}</div>
    </div>
  );
}
