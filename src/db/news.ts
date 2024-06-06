import prisma from "@/lib/prisma";
import { Prisma, News } from "@prisma/client";

export async function findNewsById(id: string): Promise<News | null> {
  return await prisma.news.findUnique({
    where: {
      id: id,
    },
  });
}

export async function createNews({
  headline,
  headlineAmharic,
  profileImage,
  body,
  bodyAmharic,
}: {
  headline: string;
  headlineAmharic: string;
  profileImage: string;
  body: string;
  bodyAmharic: string;
}) {
  try {
    const news = await prisma.news.create({
      data: { headline, headlineAmharic, profileImage, body, bodyAmharic },
    });

    return news;
  } catch (error) {
    console.error(error);

    if (error instanceof Prisma.PrismaClientKnownRequestError) {
      throw error;
    }
  }
}

export async function updateNews({
  headline,
  headlineAmharic,
  profileImage,
  body,
  bodyAmharic,
  id,
}: {
  id: string;
  headline: string;
  headlineAmharic: string;
  profileImage: string;
  body: string;
  bodyAmharic: string;
}) {
  try {
    const news = await prisma.news.update({
      where: { id: id },
      data: { headline, headlineAmharic, profileImage, body, bodyAmharic },
    });

    return news;
  } catch (error) {
    console.error(error);
    if (error instanceof Prisma.PrismaClientKnownRequestError) {
      throw error;
    }
  }
}

export async function fetchNewss({
  page,
  pageSize,
  searchText,
}: {
  page: number;
  pageSize: number;
  searchText?: string;
}): Promise<{ newss: News[] | undefined; total: number }> {
  const whereClause: Prisma.NewsWhereInput = {
    ...(searchText && {
      OR: [
        {
          headline: {
            contains: searchText,
            mode: "insensitive",
          },
        },
        {
          headlineAmharic: {
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

  const newss = await prisma.news.findMany({
    where: whereClause,
    orderBy: {
      created_at: "desc",
    },
    skip: (page - 1) * pageSize,
    take: pageSize,
  });

  const total = await prisma.news.count({
    where: whereClause,
  });

  return { newss, total };
}

export async function deleteNews({
  id,
}: {
  id: string;
}): Promise<News | undefined> {
  return await prisma.news.delete({
    where: {
      id: id,
    },
  });
}
