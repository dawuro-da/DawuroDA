import prisma from "@/lib/prisma";
import { Prisma, Initiative } from "@prisma/client";

export async function findInitiativeById(
  id: string
): Promise<Initiative | null> {
  return await prisma.initiative.findUnique({
    where: {
      id: id,
    },
  });
}

export async function createInitiative({
  nameOfInitiative,
  nameOfInitiativeAmharic,
  featuredImages,
  body,
  bodyAmharic,
}: {
  nameOfInitiative: string;
  nameOfInitiativeAmharic: string;
  featuredImages: string[];
  body: string;
  bodyAmharic: string;
}) {
  try {
    const initiative = await prisma.initiative.create({
      data: {
        nameOfInitiative,
        nameOfInitiativeAmharic,
        featuredImages,
        body,
        bodyAmharic,
      },
    });

    return initiative;
  } catch (error) {
    console.error(error);

    if (error instanceof Prisma.PrismaClientKnownRequestError) {
      throw error;
    }
  }
}

export async function updateInitiative({
  nameOfInitiative,
  nameOfInitiativeAmharic,
  featuredImages,
  body,
  bodyAmharic,
  id,
}: {
  id: string;
  nameOfInitiative: string;
  nameOfInitiativeAmharic: string;
  featuredImages: string[];
  body: string;
  bodyAmharic: string;
}) {
  try {
    const initiative = await prisma.initiative.update({
      where: { id: id },
      data: {
        nameOfInitiative,
        nameOfInitiativeAmharic,
        featuredImages,
        body,
        bodyAmharic,
      },
    });

    return initiative;
  } catch (error) {
    console.error(error);
    if (error instanceof Prisma.PrismaClientKnownRequestError) {
      throw error;
    }
  }
}

export async function fetchInitiatives({
  page,
  pageSize,
  searchText,
}: {
  page: number;
  pageSize: number;
  searchText?: string;
}): Promise<{ initiatives: Initiative[] | undefined; total: number }> {
  const whereClause: Prisma.InitiativeWhereInput = {
    ...(searchText && {
      OR: [
        {
          nameOfInitiative: {
            contains: searchText,
            mode: "insensitive",
          },
        },
        {
          nameOfInitiativeAmharic: {
            contains: searchText,
            mode: "insensitive",
          },
        },
        {
          body: {
            contains: searchText,
            mode: "insensitive",
          },
        },
        {
          bodyAmharic: {
            contains: searchText,
            mode: "insensitive",
          },
        },
      ],
    }),
  };

  const initiatives = await prisma.initiative.findMany({
    where: whereClause,
    orderBy: {
      created_at: "desc",
    },
    skip: (page - 1) * pageSize,
    take: pageSize,
  });

  const total = await prisma.initiative.count({
    where: whereClause,
  });

  return { initiatives, total };
}

export async function deleteInitiative({
  id,
}: {
  id: string;
}): Promise<Initiative | undefined> {
  return await prisma.initiative.delete({
    where: {
      id: id,
    },
  });
}
