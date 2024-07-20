import prisma from "@/lib/prisma";
import { Prisma, Management } from "@prisma/client";

export async function findManagementById(
  id: string
): Promise<Management | null> {
  return await prisma.management.findUnique({
    where: {
      id: id,
    },
  });
}

export async function createManagement({
  managerName,
  managerNameAmharic,
  job,
  jobAmharic,
  photo,
  bio,
  bioAmharic,
  isDraft,
  isBoardMember,
}: {
  isDraft: boolean;
  managerName: string;
  managerNameAmharic: string;
  job: string;
  jobAmharic: string;
  photo: string;
  bio: string;
  bioAmharic: string;
  isBoardMember: boolean;
}) {
  try {
    const management = await prisma.management.create({
      data: {
        isDraft,
        managerName,
        managerNameAmharic,
        job,
        jobAmharic,
        photo,
        bio,
        bioAmharic,
        isBoardMember,
      },
    });

    return management;
  } catch (error) {
    console.error(error);

    if (error instanceof Prisma.PrismaClientKnownRequestError) {
      throw error;
    }
  }
}

export async function updateManagement({
  managerName,
  managerNameAmharic,
  job,
  jobAmharic,
  photo,
  bio,
  bioAmharic,
  id,
  isDraft,
  isBoardMember,
}: {
  id: string;
  isDraft: boolean;
  managerName: string;
  managerNameAmharic: string;
  job: string;
  jobAmharic: string;
  photo: string;
  bio: string;
  bioAmharic: string;
  isBoardMember: boolean;
}) {
  try {
    const management = await prisma.management.update({
      where: { id: id },
      data: {
        managerName,
        isDraft,
        managerNameAmharic,
        job,
        jobAmharic,
        photo,
        bio,
        bioAmharic,
        isBoardMember
      },
    });

    return management;
  } catch (error) {
    console.error(error);
    if (error instanceof Prisma.PrismaClientKnownRequestError) {
      throw error;
    }
  }
}

export async function fetchManagements({
  page,
  pageSize,
  searchText,
}: {
  page: number;
  pageSize: number;
  searchText?: string;
}): Promise<{ managements: Management[] | undefined; total: number }> {
  const whereClause: Prisma.ManagementWhereInput = {
    ...(searchText && {
      OR: [
        {
          managerName: {
            contains: searchText,
            mode: "insensitive",
          },
        },
        {
          managerNameAmharic: {
            contains: searchText,
            mode: "insensitive",
          },
        },
        {
          job: {
            contains: searchText,
            mode: "insensitive",
          },
        },
        {
          jobAmharic: {
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

  const managements = await prisma.management.findMany({
    where: whereClause,
    orderBy: {
      created_at: "asc",
    },
    skip: (page - 1) * pageSize,
    take: pageSize,
  });

  const total = await prisma.management.count({
    where: whereClause,
  });

  return { managements, total };
}

export async function deleteManagement({
  id,
}: {
  id: string;
}): Promise<Management | undefined> {
  return await prisma.management.delete({
    where: {
      id: id,
    },
  });
}
