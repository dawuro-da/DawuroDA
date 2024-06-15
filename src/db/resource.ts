import prisma from "@/lib/prisma";
import { Prisma, Resource } from "@prisma/client";

export async function findResourceById(id: string): Promise<Resource | null> {
  return await prisma.resource.findUnique({
    where: {
      id: id,
    },
  });
}

export async function createResource({
  name,
  document,
  description,
  isDraft,
}: {
  isDraft: boolean;
  name: string;
  document: string;
  description: string;
}) {
  try {
    const resource = await prisma.resource.create({
      data: { name, description, document, isDraft },
    });

    return resource;
  } catch (error) {
    console.error(error);

    if (error instanceof Prisma.PrismaClientKnownRequestError) {
      throw error;
    }
  }
}

export async function updateResource({
  name,
  document,
  description,
  id,
  isDraft,
}: {
  id: string;
  name: string;
  document: string;
  description: string;
  isDraft: boolean;
}) {
  try {
    const resource = await prisma.resource.update({
      where: { id: id },
      data: { name, document, description, isDraft },
    });

    return resource;
  } catch (error) {
    console.error(error);
    if (error instanceof Prisma.PrismaClientKnownRequestError) {
      throw error;
    }
  }
}

export async function fetchResources({
  page,
  pageSize,
  searchText,
}: {
  page: number;
  pageSize: number;
  searchText?: string;
}): Promise<{ resources: Resource[] | undefined; total: number }> {
  const whereClause: Prisma.ResourceWhereInput = {
    ...(searchText && {
      OR: [
        {
          name: {
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

  const resources = await prisma.resource.findMany({
    where: whereClause,
    orderBy: {
      created_at: "desc",
    },
    skip: (page - 1) * pageSize,
    take: pageSize,
  });

  const total = await prisma.resource.count({
    where: whereClause,
  });

  return { resources, total };
}

export async function deleteResource({
  id,
}: {
  id: string;
}): Promise<Resource | undefined> {
  return await prisma.resource.delete({
    where: {
      id: id,
    },
  });
}
