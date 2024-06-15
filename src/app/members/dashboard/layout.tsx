import { OPTIONS } from "@/util/authOptions";
import Sidebar from "@/components/shared/sidebar/Sidebar";
import { getServerSession } from "next-auth";
import { redirect } from "next/navigation";

export default async function AdminLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const session = await getServerSession(OPTIONS);
  if (!session?.user?.id) {
    redirect("/login");
  }

  return (
    <div className="flex flex-row h-screen w-screen relative">
      <Sidebar />
      <div className="flex-1 max-w-full overflow-y-scroll">{children}</div>
    </div>
  );
}
