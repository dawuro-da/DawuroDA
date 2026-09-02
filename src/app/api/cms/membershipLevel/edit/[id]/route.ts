import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { OPTIONS } from "@/util/authOptions";
import { UserRole } from "@prisma/client";
import {
  findMembershipLevelById,
  updateMembershipLevel,
} from "@/db/membershipLevel";
import { createAuditLog, diffFields } from "@/db/auditLog";

export async function POST(
  req: Request,
  context: { params: { id: string } }
) {
  const session = await getServerSession(OPTIONS);
  const isStaff = Boolean(
    session?.user?.role && session.user.role !== UserRole.Member
  );
  if (!isStaff) {
    return NextResponse.json(
      { success: false, error: "Unauthorized" },
      { status: 401 }
    );
  }

  try {
    const {
      name,
      nameAmharic,
      sortOrder,
      isActive,
      individualYearlyMin,
      companyYearlyMin,
      idTemplateImage,
    } = await req.json();

    const existingLevel = await findMembershipLevelById(context.params.id);

    const result = await updateMembershipLevel({
      id: context.params.id,
      data: {
        ...(name !== undefined && { name: String(name).trim() }),
        ...(nameAmharic !== undefined && { nameAmharic }),
        ...(sortOrder !== undefined && { sortOrder: Number(sortOrder) }),
        ...(isActive !== undefined && { isActive: Boolean(isActive) }),
        ...(individualYearlyMin !== undefined && {
          individualYearlyMin: Number(individualYearlyMin),
        }),
        ...(companyYearlyMin !== undefined && {
          companyYearlyMin: Number(companyYearlyMin),
        }),
        ...(idTemplateImage !== undefined && { idTemplateImage }),
      },
    });

    if (existingLevel && session?.user) {
      const changes = diffFields(
        existingLevel,
        {
          name,
          nameAmharic,
          sortOrder: sortOrder !== undefined ? Number(sortOrder) : undefined,
          isActive: isActive !== undefined ? Boolean(isActive) : undefined,
          individualYearlyMin:
            individualYearlyMin !== undefined
              ? Number(individualYearlyMin)
              : undefined,
          companyYearlyMin:
            companyYearlyMin !== undefined
              ? Number(companyYearlyMin)
              : undefined,
          idTemplateImage,
        },
        [
          "name",
          "nameAmharic",
          "sortOrder",
          "isActive",
          "individualYearlyMin",
          "companyYearlyMin",
          "idTemplateImage",
        ]
      );
      await createAuditLog({
        entityType: "MembershipLevel",
        entityId: context.params.id,
        entityLabel: existingLevel.name,
        action: "UPDATE",
        changes,
        performedById: session.user.id,
        performedByName:
          `${session.user.firstName ?? ""} ${
            session.user.lastName ?? ""
          }`.trim() || undefined,
        performedByRole: session.user.role,
      });
    }

    return NextResponse.json(
      { success: true, value: result },
      { status: 200 }
    );
  } catch (err: any) {
    console.warn(err);
    const isDuplicate = err?.code === "P2002";
    return NextResponse.json(
      {
        success: false,
        error: isDuplicate
          ? "A membership level with this name already exists"
          : "Unable to update membership level",
      },
      { status: isDuplicate ? 409 : 500 }
    );
  }
}
