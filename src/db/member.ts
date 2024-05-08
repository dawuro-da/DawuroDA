import prisma from "@/lib/prisma";
import {
  Gender,
  Prisma,
  Member,
  MembershipLevel,
  ContributionSystem,
  MembershipType,
} from "@prisma/client";

export async function findMemberByEmail(email: string): Promise<Member | null> {
  try {
    return await prisma.member.findUnique({
      where: {
        email,
      },
    });
  } catch (err) {
    console.error(err);
    return null;
  }
}

export async function findMemberByPhone(phone: string): Promise<Member | null> {
  try {
    return await prisma.member.findUnique({
      where: {
        phone: phone,
      },
    });
  } catch (err) {
    console.error(err);
    return null;
  }
}

export async function findMemberById(id: string): Promise<Member | null> {
  return await prisma.member.findUnique({
    where: {
      id: id,
    },
  });
}

export interface MemberDataType {
  email: string;
  phone: string;
  membershipLevel: MembershipLevel;
  contributionAmount: number;
  contributionSystem: ContributionSystem;
  lastPaidAt: string;
  nextDueDate: string;
  hasPaid: boolean;
  membershipType: MembershipType;
  region: string;
  city: string;
  zone: string;
  kebele?: string;
  companyName?: string;
  firstName?: string;
  lastName?: string;
  gender?: Gender;
  expertise?: string;
  positionAtWork?: string;
  dateOfBirth?: string;
  registeredBy?: string;
}

export async function createMember({
  firstName,
  lastName,
  gender,
  registeredBy,
  email,
  phone,
  zone,
  city,
  contributionAmount,
  contributionSystem,
  hasPaid,
  lastPaidAt,
  membershipLevel,
  membershipType,
  nextDueDate,
  region,
  companyName,
  dateOfBirth,
  expertise,
  kebele,
  positionAtWork,
  password_hash,
  password_salt,
  memberId,
}: MemberDataType & {
  memberId: string;
  password_hash: string;
  password_salt: string;
}) {
  try {
    const member = await prisma.member.create({
      data: {
        memberId,
        firstName,
        lastName,
        gender,
        registeredBy,
        email,
        phone,
        zone,
        city,
        contributionAmount,
        contributionSystem,
        hasPaid,
        lastPaidAt,
        membershipLevel,
        membershipType,
        nextDueDate,
        region,
        companyName,
        dateOfBirth,
        expertise,
        kebele,
        positionAtWork,
        password_hash,
        password_salt,
      },
    });

    return member;
  } catch (error) {
    console.error(error);

    if (error instanceof Prisma.PrismaClientKnownRequestError) {
      throw error;
    }
  }
}

export async function updateMember(
  memberData: MemberDataType & { id: string }
) {
  try {
    const member = await prisma.member.update({
      where: { id: memberData.id },
      data: memberData,
    });

    return member;
  } catch (error) {
    if (error instanceof Prisma.PrismaClientKnownRequestError) {
      throw error;
    }
  }
}

export async function fetchMembers({
  page,
  pageSize,
}: {
  page: number;
  pageSize: number;
}): Promise<Member[] | undefined> {
  return await prisma.member.findMany({
    where: {},

    orderBy: {
      created_at: "desc",
    },
    skip: (page - 1) * pageSize,
    take: pageSize,
  });
}

/**
 *
 * @param searchText @param page @param pageSize are the props recieved and then
 * searchs in the db if some field contained the search text
 * @returns
 *     - data => member found in this @param page
 *     - total count => to make the pagination of searched data
 */
export async function searchMembers({
  searchText,
  page,
  pageSize,
}: {
  searchText: string;
  page: number;
  pageSize: number;
}): Promise<{ members: Member[]; membersCount: number } | undefined> {
  const whereClause: Prisma.MemberWhereInput = {
    OR: [
      {
        firstName: {
          contains: searchText,
          mode: "insensitive",
        },
      },
      {
        companyName: {
          contains: searchText,
          mode: "insensitive",
        },
      },
      {
        lastName: {
          contains: searchText,
          mode: "insensitive",
        },
      },
      {
        email: {
          contains: searchText,
          mode: "insensitive",
        },
      },
      {
        phone: {
          contains: searchText,
          mode: "insensitive",
        },
      },
    ],
  };

  const members = await prisma.member.findMany({
    where: whereClause,
    orderBy: {
      created_at: "desc",
    },
    skip: (page - 1) * pageSize,
    take: pageSize,
  });
  const membersCount = await prisma.member.count({
    where: whereClause,
  });

  return { members, membersCount };
}

export async function deleteMember({
  id,
}: {
  id: string;
}): Promise<Member | undefined> {
  return await prisma.member.delete({
    where: {
      id: id,
    },
  });
}
