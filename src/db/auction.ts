import prisma from "@/lib/prisma";
import { Prisma, Auction } from "@prisma/client";

export async function findAuctionById(id: string): Promise<Auction | null> {
  return await prisma.auction.findUnique({
    where: {
      id: id,
    },
  });
}

export async function createAuction({
  title,
  description,
  CPO,
  formPayment,
  endDate,
  startDate,
  formFile,
  isPurchasing,
}: {
  title: string;
  description: string;
  CPO: string;
  endDate: string;
  formPayment: string;
  startDate: string;
  formFile: string;
  isPurchasing: boolean;
}) {
  try {
    const auction = await prisma.auction.create({
      data: {
        formPayment: parseFloat(formPayment),
        title,
        description,
        CPO: parseFloat(CPO),
        endDate,
        startDate,
        formFile,
        isPurchasing,
      },
    });

    return auction;
  } catch (error) {
    console.error(error);

    if (error instanceof Prisma.PrismaClientKnownRequestError) {
      throw error;
    }
  }
}

export async function updateAuction({
  title,
  description,
  CPO,
  endDate,
  startDate,
  id,
  formPayment,
  formFile,
  isPurchasing,
}: {
  id: string;
  title: string;
  description: string;
  formPayment: string;
  CPO: string;
  endDate: string;
  startDate: string;
  formFile: string;
  isPurchasing: boolean;
}) {
  try {
    const auction = await prisma.auction.update({
      where: { id: id },
      data: {
        formPayment: parseFloat(formPayment),
        title,
        description,
        CPO: parseFloat(CPO),
        endDate,
        startDate,
        formFile,
        isPurchasing,
      },
    });

    return auction;
  } catch (error) {
    console.error(error);
    if (error instanceof Prisma.PrismaClientKnownRequestError) {
      throw error;
    }
  }
}

export async function fetchAuctions({
  page,
  pageSize,
  filters,
}: {
  page: number;
  pageSize: number;
  filters?: {
    startDate: string;
    endDate: string;
    searchText: string;
  };
}): Promise<{ auctions: Auction[] | undefined; total: number }> {
  const whereClause: Prisma.AuctionWhereInput = {
    ...(filters?.startDate &&
      filters?.endDate && {
        created_at: {
          gte: filters?.startDate,
          lte: filters?.endDate,
        },
      }),
    ...(filters?.startDate &&
      !filters?.endDate && {
        created_at: {
          gte: filters?.startDate,
        },
      }),
    ...(!filters?.startDate &&
      filters?.endDate && {
        created_at: {
          lte: filters?.endDate,
        },
      }),
    ...(filters?.searchText && {
      OR: [
        {
          title: {
            contains: filters?.searchText,
            mode: "insensitive",
          },
        },
        {
          description: {
            contains: filters?.searchText,
            mode: "insensitive",
          },
        },
      ],
    }),
  };

  const auctions = await prisma.auction.findMany({
    where: whereClause,
    orderBy: {
      created_at: "desc",
    },
    skip: (page - 1) * pageSize,
    take: pageSize,
  });

  const total = await prisma.auction.count({
    where: whereClause,
  });

  return { auctions, total };
}

export async function deleteAuction({
  id,
}: {
  id: string;
}): Promise<Auction | undefined> {
  return await prisma.auction.delete({
    where: {
      id: id,
    },
  });
}
