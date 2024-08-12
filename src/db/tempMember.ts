import prisma from "@/lib/prisma";
import {
  Gender,
  Prisma,
  TempMember,
  MembershipLevel,
  ContributionSystem,
  MembershipType,
  PaymentMeans,
  EducationLevel,
} from "@prisma/client";

export async function findTempMemberByEmailAndPhone({
  email,
  phone,
}: {
  email: string;
  phone: string;
}): Promise<TempMember | null> {
  try {
    return await prisma.tempMember.findFirst({
      where: {
        email,
        phone,
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
      orderBy: {
        created_at: "desc",
      },
    });
  } catch (err) {
    console.error(err);
    return null;
  }
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
    educationLevel: EducationLevel;
    expertise: string;
    dateOfBirth: string;
    workPlace: string;
    profileImage: string;
    idNumber: string;
    branch: string;
    country: string;
    nationality: string;
    lastPaidAt: string;
    nextDueDate: string;
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

export async function deleteTempMemberByPhone({
  phone,
}: {
  phone: string;
}): Promise<boolean> {
  const members = await prisma.tempMember.findMany({
    where: {
      phone,
    },
  });
  members.map(async (member) => {
    await prisma.tempMember.delete({ where: { id: member.id } });
  });

  return true;
}
