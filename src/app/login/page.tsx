import Auth from "@/components/auth";
import { getServerSession } from "next-auth";
import { OPTIONS } from "@/util/authOptions";
import { redirect } from "next/navigation";

export default async function Page() {
  const session = await getServerSession(OPTIONS);
  if (session?.user?.role === "Member") {
    redirect("members/dashboard");
  } else if (session?.user?.id) {
    redirect("/admin/dashboard");
  }
  return <Auth />;
}
