import prisma from "@/lib/prisma";
import {
  Prisma,
  Member,
  MembershipLevel,
  ContributionSystem,
  MembershipType,
  PaymentMeans,
  GeneralDonation,
} from "@prisma/client";

type Filters = {
  membershipLevel?: MembershipLevel;
  contributionSystem?: ContributionSystem;
  membershipType?: MembershipType;
  paymentStatus?: string;
  paymentMeans?: PaymentMeans;
  startDate?: Date;
  endDate?: Date;
};

export async function fetchDonations({
  page,
  pageSize,
  filters,
  searchText,
}: {
  page: number;
  pageSize: number;
  filters: Filters;
  searchText?: string;
}): Promise<{
  donations: GeneralDonation[] | undefined;
  total: number;
  totalDonations: number;
}> {
  const whereClause: Prisma.GeneralDonationWhereInput = {
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
  };

  const donations = await prisma.generalDonation.findMany({
    where: whereClause,
    orderBy: {
      created_at: "desc",
    },
    skip: (page - 1) * pageSize,
    take: pageSize,
  });

  const total = await prisma.generalDonation.count({
    where: whereClause,
  });

  const totalDonations = await prisma.generalDonation.aggregate({
    where: whereClause,
    _sum: { amount: true },
  });

  return { donations, total, totalDonations: totalDonations._sum.amount ?? 0 };
}

export async function fetchAllDonations({
  filters,
}: {
  filters: Filters;
}): Promise<{ donations: GeneralDonation[] | undefined; total: number }> {
  const whereClause: Prisma.GeneralDonationWhereInput = {
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
  };

  const donations = await prisma.generalDonation.findMany({
    where: whereClause,
    orderBy: {
      created_at: "desc",
    },
  });

  const total = await prisma.generalDonation.count({
    where: whereClause,
  });

  return { donations, total };
}
