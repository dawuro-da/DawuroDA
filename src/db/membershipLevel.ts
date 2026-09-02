import prisma from "@/lib/prisma";
import { MembershipLevelConfig } from "@prisma/client";

export async function fetchMembershipLevels({
  activeOnly,
}: {
  activeOnly?: boolean;
} = {}): Promise<MembershipLevelConfig[]> {
  return await prisma.membershipLevelConfig.findMany({
    where: activeOnly ? { isActive: true } : undefined,
    orderBy: { sortOrder: "asc" },
  });
}

export async function findMembershipLevelByName(
  name: string
): Promise<MembershipLevelConfig | null> {
  return await prisma.membershipLevelConfig.findUnique({ where: { name } });
}

export async function findMembershipLevelById(
  id: string
): Promise<MembershipLevelConfig | null> {
  return await prisma.membershipLevelConfig.findUnique({ where: { id } });
}

export async function createMembershipLevel(data: {
  name: string;
  nameAmharic?: string;
  sortOrder?: number;
  individualYearlyMin: number;
  companyYearlyMin: number;
  idTemplateImage?: string;
}): Promise<MembershipLevelConfig> {
  return await prisma.membershipLevelConfig.create({ data });
}

export async function updateMembershipLevel({
  id,
  data,
}: {
  id: string;
  data: {
    name?: string;
    nameAmharic?: string;
    sortOrder?: number;
    isActive?: boolean;
    individualYearlyMin?: number;
    companyYearlyMin?: number;
    idTemplateImage?: string;
  };
}): Promise<MembershipLevelConfig> {
  return await prisma.membershipLevelConfig.update({ where: { id }, data });
}

// Hard-deletes only when nothing references this level by name, since
// Member.membershipLevel/TempMember.membershipLevel are plain strings with
// no foreign key to enforce that — deleting a level still in use would
// leave those members pointing at a name that no longer resolves to any
// config (breaking their ID card template/pricing lookups). Deactivating
// (isActive: false, via updateMembershipLevel) is the safe alternative that
// still hides it from new selections.
export async function deleteMembershipLevel(
  id: string
): Promise<{ deleted: boolean; membersUsingIt?: number }> {
  const level = await prisma.membershipLevelConfig.findUnique({
    where: { id },
  });
  if (!level) return { deleted: false, membersUsingIt: 0 };

  const [memberCount, tempMemberCount] = await Promise.all([
    prisma.member.count({ where: { membershipLevel: level.name } }),
    prisma.tempMember.count({ where: { membershipLevel: level.name } }),
  ]);
  const membersUsingIt = memberCount + tempMemberCount;
  if (membersUsingIt > 0) {
    return { deleted: false, membersUsingIt };
  }

  await prisma.membershipLevelConfig.delete({ where: { id } });
  return { deleted: true };
}
