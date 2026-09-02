import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { OPTIONS } from "@/util/authOptions";
import { UserRole } from "@prisma/client";
import { fetchAuditLogs } from "@/db/auditLog";

export async function POST(req: Request) {
  const session = await getServerSession(OPTIONS);
  if (!session?.user?.id || session.user.role !== UserRole.Owner) {
    return NextResponse.json(
      { success: false, error: "Unauthorized" },
      { status: 401 }
    );
  }

  const { page, pageSize, entityType } = await req.json().catch(() => ({}));

  try {
    const result = await fetchAuditLogs({
      page: Number(page) || 1,
      pageSize: Number(pageSize) || 20,
      entityType: entityType || undefined,
    });
    return NextResponse.json({ success: true, value: result }, { status: 200 });
  } catch (err) {
    console.warn(err);
    return NextResponse.json(
      { success: false, error: "Unable to fetch content history" },
      { status: 500 }
    );
  }
}
