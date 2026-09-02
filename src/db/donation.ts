import prisma from "@/lib/prisma";
import {
  Prisma,
  ContributionSystem,
  MembershipType,
  PaymentMeans,
  GeneralDonation,
} from "@prisma/client";

type Filters = {
  membershipLevel?: string;
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

export async function createDonation({
  amount,
  donationDesignation,
  fullName,
  phone,
  branch,
  campaignId,
  txRef,
}: {
  amount: string;
  donationDesignation: string;
  fullName: string;
  phone: string;
  branch: string;
  campaignId?: string | null;
  txRef?: string | null;
}) {
  const parsedAmount = parseFloat(amount);
  try {
    // Campaign progress is derived entirely from real donation records
    // (this function is the single path both the Chapa webhook and the
    // admin's manual "Record Donation" action go through) rather than being
    // hand-typed, so raisedAmount can't drift from what was actually given.
    const [donation] = await prisma.$transaction([
      prisma.generalDonation.create({
        data: {
          amount: parsedAmount,
          donationDesignation,
          fullName,
          phone,
          branch,
          campaignId: campaignId ?? undefined,
          txRef: txRef ?? undefined,
        },
      }),
      ...(campaignId
        ? [
            prisma.campaign.update({
              where: { id: campaignId },
              data: { raisedAmount: { increment: parsedAmount } },
            }),
          ]
        : []),
    ]);
    return donation;
  } catch (err) {
    console.warn(err);
    return null;
  }
}

export async function findDonationByTxRef(
  txRef: string
): Promise<GeneralDonation | null> {
  try {
    return await prisma.generalDonation.findUnique({ where: { txRef } });
  } catch (err) {
    console.warn(err);
    return null;
  }
}
