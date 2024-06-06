import prisma from "@/lib/prisma";
import { Prisma, Partnership } from "@prisma/client";

export async function findPartnershipById(
  id: string
): Promise<Partnership | null> {
  return await prisma.partnership.findUnique({
    where: {
      id: id,
    },
  });
}

export async function createPartnership({
  partnerName,
  partnerNameAmharic,
  logo,
  bio,
  bioAmharic,
}: {
  partnerName: string;
  partnerNameAmharic: string;
  logo: string;
  bio: string;
  bioAmharic: string;
}) {
  try {
    const partnership = await prisma.partnership.create({
      data: { partnerName, partnerNameAmharic, logo, bio, bioAmharic },
    });

    return partnership;
  } catch (error) {
    console.error(error);

    if (error instanceof Prisma.PrismaClientKnownRequestError) {
      throw error;
    }
  }
}

export async function updatePartnership({
  partnerName,
  partnerNameAmharic,
  logo,
  bio,
  bioAmharic,
  id,
}: {
  id: string;
  partnerName: string;
  partnerNameAmharic: string;
  logo: string;
  bio: string;
  bioAmharic: string;
}) {
  try {
    const partnership = await prisma.partnership.update({
      where: { id: id },
      data: { partnerName, partnerNameAmharic, logo, bio, bioAmharic },
    });

    return partnership;
  } catch (error) {
    console.error(error);
    if (error instanceof Prisma.PrismaClientKnownRequestError) {
      throw error;
    }
  }
}

export async function fetchPartnerships({
  page,
  pageSize,
  searchText,
}: {
  page: number;
  pageSize: number;
  searchText?: string;
}): Promise<{ partnerships: Partnership[] | undefined; total: number }> {
  const whereClause: Prisma.PartnershipWhereInput = {
    ...(searchText && {
      OR: [
        {
          partnerName: {
            contains: searchText,
            mode: "insensitive",
          },
        },
        {
          partnerNameAmharic: {
            contains: searchText,
            mode: "insensitive",
          },
        },
        {
          bio: {
            contains: searchText,
            mode: "insensitive",
          },
        },
        {
          bioAmharic: {
            contains: searchText,
            mode: "insensitive",
          },
        },
      ],
    }),
  };

  const partnerships = await prisma.partnership.findMany({
    where: whereClause,
    orderBy: {
      created_at: "desc",
    },
    skip: (page - 1) * pageSize,
    take: pageSize,
  });

  const total = await prisma.partnership.count({
    where: whereClause,
  });

  return { partnerships, total };
}

export async function deletePartnership({
  id,
}: {
  id: string;
}): Promise<Partnership | undefined> {
  return await prisma.partnership.delete({
    where: {
      id: id,
    },
  });
}
