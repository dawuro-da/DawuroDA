import prisma from "@/lib/prisma";
import {
  Gender,
  Prisma,
  Member,
  MembershipLevel,
  ContributionSystem,
  MembershipType,
  PaymentMeans,
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

export async function findById(id: string): Promise<Member | null> {
  try {
    return await prisma.member.findUnique({
      where: {
        id,
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

export interface MemberSharedDataType {
  email?: string;
  phone: string;
  membershipLevel: MembershipLevel;
  contributionAmount: number;
  contributionSystem: ContributionSystem;
  hasPaid: boolean;
  membershipType: MembershipType;
  region: string;
  city: string;
  zone: string;
  kebele?: string;
  positionAtWork: string;
  paymentMeans: PaymentMeans;
}

export async function createIndividualMember({
  individualData,
}: {
  individualData: MemberSharedDataType & {
    firstName: string;
    lastName: string;
    gender: Gender;
    educationLevel: string;
    expertise: string;
    dateOfBirth: string;
    workPlace: string;
    profileImage: string;
    idNumber: string;
    branch: string;
    lastPaidAt: string;
    nextDueDate: string;
    registeredBy: string;
    password_hash: string;
    password_salt: string;
    memberId: string;
  };
}) {
  try {
    const member = await prisma.member.create({
      data: { ...individualData },
    });

    return member;
  } catch (error) {
    console.error(error);

    if (error instanceof Prisma.PrismaClientKnownRequestError) {
      throw error;
    }
  }
}

export async function createInstitutionMember({
  institutionData,
}: {
  institutionData: MemberSharedDataType & {
    institutionName: string;
    headOrRepresentative: string;
    fieldOfWork: string;
    partnershipIdea: string;
    lastPaidAt: string;
    nextDueDate: string;
    registeredBy: string;
    password_hash: string;
    password_salt: string;
    memberId: string;
  };
}) {
  try {
    const member = await prisma.member.create({
      data: { ...institutionData },
    });

    return member;
  } catch (error) {
    console.error(error);

    if (error instanceof Prisma.PrismaClientKnownRequestError) {
      throw error;
    }
  }
}

export async function updateIndividualMember({
  memberData,
  id,
}: {
  id: string;
  memberData: MemberSharedDataType & {
    firstName: string;
    lastName: string;
    gender: Gender;
    educationLevel: string;
    expertise: string;
    dateOfBirth: string;
    workPlace: string;
    profileImage: string;
    idNumber: string;
    branch: string;
  };
}) {
  try {
    const member = await prisma.member.update({
      where: { id: id },
      data: memberData,
    });

    return member;
  } catch (error) {
    console.error(error);
    if (error instanceof Prisma.PrismaClientKnownRequestError) {
      throw error;
    }
  }
}

export async function updateInstitutionMember({
  memberData,
  id,
}: {
  id: string;
  memberData: MemberSharedDataType & {
    institutionName: string;
    headOrRepresentative: string;
    fieldOfWork: string;
    partnershipIdea: string;
  };
}) {
  try {
    const member = await prisma.member.update({
      where: { id: id },
      data: memberData,
    });

    return member;
  } catch (error) {
    console.error(error);
    if (error instanceof Prisma.PrismaClientKnownRequestError) {
      throw error;
    }
  }
}

type Filters = {
  membershipLevel?: MembershipLevel;
  contributionSystem?: ContributionSystem;
  membershipType?: MembershipType;
  paymentStatus?: string;
  paymentMeans?: PaymentMeans;
  startDate?: Date;
  endDate?: Date;
};

export async function fetchMembers({
  page,
  pageSize,
  filters,
  searchText,
}: {
  page: number;
  pageSize: number;
  filters: Filters;
  searchText?: string;
}): Promise<{ members: Member[] | undefined; total: number }> {
  const whereClause: Prisma.MemberWhereInput = {
    ...(filters.contributionSystem && {
      contributionSystem: filters.contributionSystem,
    }),
    ...(filters.startDate &&
      filters.endDate && {
        created_at: {
          gte: filters.startDate,
          lte: filters.endDate,
        },
      }),
    ...(filters.startDate &&
      !filters.endDate && {
        created_at: {
          gte: filters.startDate,
        },
      }),
    ...(!filters.startDate &&
      filters.endDate && {
        created_at: {
          lte: filters.endDate,
        },
      }),
    ...(filters.membershipLevel && {
      membershipLevel: filters.membershipLevel,
    }),
    ...(filters.membershipType && {
      membershipType: filters.membershipType,
    }),
    ...(filters.paymentMeans && {
      paymentMeans: filters.paymentMeans,
    }),
    ...(filters.paymentStatus && {
      hasPaid: filters.paymentStatus === "paid" ? true : false,
    }),
    ...(searchText && {
      OR: [
        {
          firstName: {
            contains: searchText,
            mode: "insensitive",
          },
        },
        {
          institutionName: {
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
    }),
  };

  const members = await prisma.member.findMany({
    where: whereClause,
    orderBy: {
      created_at: "desc",
    },
    skip: (page - 1) * pageSize,
    take: pageSize,
  });

  const total = await prisma.member.count({
    where: whereClause,
  });

  return { members, total };
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
        institutionName: {
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
