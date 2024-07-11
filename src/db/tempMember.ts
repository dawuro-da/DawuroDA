import prisma from "@/lib/prisma";
import {
  Gender,
  Prisma,
  TempMember,
  MembershipLevel,
  ContributionSystem,
  MembershipType,
  PaymentMeans,
} from "@prisma/client";

export async function findTempMemberByEmail(
  email: string
): Promise<TempMember | null> {
  try {
    return await prisma.tempMember.findFirst({
      where: {
        email,
      },
    });
  } catch (err) {
    console.error(err);
    return null;
  }
}

export async function findById(id: string): Promise<TempMember | null> {
  try {
    return await prisma.tempMember.findUnique({
      where: {
        id,
      },
    });
  } catch (err) {
    console.error(err);
    return null;
  }
}

export async function findTempMemberByPhone(
  phone: string
): Promise<TempMember | null> {
  try {
    return await prisma.tempMember.findFirst({
      where: {
        phone: phone,
      },
    });
  } catch (err) {
    console.error(err);
    return null;
  }
}

export async function findTempMemberById(
  id: string
): Promise<TempMember | null> {
  return await prisma.tempMember.findUnique({
    where: {
      id: id,
    },
  });
}

export interface TempMemberSharedDataType {
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

export async function createIndividualTempMember({
  individualData,
}: {
  individualData: TempMemberSharedDataType & {
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
  };
}) {
  try {
    const tempMember = await prisma.tempMember.create({
      data: { ...individualData },
    });

    return tempMember;
  } catch (error) {
    console.error(error);

    if (error instanceof Prisma.PrismaClientKnownRequestError) {
      throw error;
    }
  }
}

export async function createInstitutionTempMember({
  institutionData,
}: {
  institutionData: TempMemberSharedDataType & {
    institutionName: string;
    headOrRepresentative: string;
    fieldOfWork: string;
    partnershipIdea: string;
    lastPaidAt: string;
    nextDueDate: string;
    registeredBy: string;
    password_hash: string;
    password_salt: string;
  };
}) {
  try {
    const tempMember = await prisma.tempMember.create({
      data: { ...institutionData },
    });

    return tempMember;
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

export async function fetchTempMembers({
  page,
  pageSize,
  filters,
  searchText,
}: {
  page: number;
  pageSize: number;
  filters: Filters;
  searchText?: string;
}): Promise<{ tempMembers: TempMember[] | undefined; total: number }> {
  const whereClause: Prisma.TempMemberWhereInput = {
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

  const tempMembers = await prisma.tempMember.findMany({
    where: whereClause,
    orderBy: {
      created_at: "desc",
    },
    skip: (page - 1) * pageSize,
    take: pageSize,
  });

  const total = await prisma.tempMember.count({
    where: whereClause,
  });

  return { tempMembers, total };
}

export async function fetchAllTempMembers({
  filters,
  searchText,
}: {
  filters: Filters;
  searchText?: string;
}): Promise<{ tempMembers: TempMember[] | undefined; total: number }> {
  const whereClause: Prisma.TempMemberWhereInput = {
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

  const tempMembers = await prisma.tempMember.findMany({
    where: whereClause,
    orderBy: {
      created_at: "desc",
    },
  });

  const total = await prisma.tempMember.count({
    where: whereClause,
  });

  return { tempMembers, total };
}

export async function fetchTempMembersWithUpcomingPayments() {
  // Get the current date
  const currentDate = new Date();

  // Calculate the date 3 days from now
  const dateThreeDaysFromNow = new Date();
  dateThreeDaysFromNow.setDate(currentDate.getDate() + 3);

  // Fetch tempMembers whose nextPaymentDate is within the next 3 days
  const tempMembers = await prisma.tempMember.findMany({
    where: {
      nextDueDate: {
        lte: dateThreeDaysFromNow,
      },
    },
  });

  return tempMembers;
}

export async function fetchRecentTempMembers(): Promise<
  TempMember[] | undefined
> {
  const tempMembers = await prisma.tempMember.findMany({
    orderBy: {
      created_at: "desc",
    },
    take: 10,
  });

  return tempMembers;
}

/**
 *
 * @param searchText @param page @param pageSize are the props recieved and then
 * searchs in the db if some field contained the search text
 * @returns
 *     - data => tempMember found in this @param page
 *     - total count => to make the pagination of searched data
 */
export async function searchTempMembers({
  searchText,
  page,
  pageSize,
}: {
  searchText: string;
  page: number;
  pageSize: number;
}): Promise<
  { tempMembers: TempMember[]; tempMembersCount: number } | undefined
> {
  const whereClause: Prisma.TempMemberWhereInput = {
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

  const tempMembers = await prisma.tempMember.findMany({
    where: whereClause,
    orderBy: {
      created_at: "desc",
    },
    skip: (page - 1) * pageSize,
    take: pageSize,
  });
  const tempMembersCount = await prisma.tempMember.count({
    where: whereClause,
  });

  return { tempMembers, tempMembersCount };
}

export async function deleteTempMember({
  id,
}: {
  id: string;
}): Promise<TempMember | undefined> {
  return await prisma.tempMember.delete({
    where: {
      id: id,
    },
  });
}
