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
  endDate,
  startDate,
}: {
  title: string;
  description: string;
  CPO: string;
  endDate: string;
  startDate: string;
}) {
  try {
    const auction = await prisma.auction.create({
      data: { title, description, CPO: parseFloat(CPO), endDate, startDate },
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
}: {
  id: string;
  title: string;
  description: string;
  CPO: string;
  endDate: string;
  startDate: string;
}) {
  try {
    const auction = await prisma.auction.update({
      where: { id: id },
      data: { title, description, CPO: parseFloat(CPO), endDate, startDate },
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
  searchText,
}: {
  page: number;
  pageSize: number;
  searchText?: string;
}): Promise<{ auctions: Auction[] | undefined; total: number }> {
  const whereClause: Prisma.AuctionWhereInput = {
    ...(searchText && {
      OR: [
        {
          title: {
            contains: searchText,
            mode: "insensitive",
          },
        },
        {
          description: {
            contains: searchText,
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
