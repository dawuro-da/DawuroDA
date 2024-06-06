import prisma from "@/lib/prisma";
import { Prisma, Faq } from "@prisma/client";

export async function findFaqById(id: string): Promise<Faq | null> {
  return await prisma.faq.findUnique({
    where: {
      id: id,
    },
  });
}

export async function createFaq({
  question,
  answer,
}: {
  question: string;
  answer: string;
}) {
  try {
    const faq = await prisma.faq.create({
      data: {
        question,
        answer,
      },
    });

    return faq;
  } catch (error) {
    console.error(error);

    if (error instanceof Prisma.PrismaClientKnownRequestError) {
      throw error;
    }
  }
}

export async function updateFaq({
  question,
  answer,
  id,
}: {
  id: string;
  question: string;
  answer: string;
}) {
  try {
    const faq = await prisma.faq.update({
      where: { id: id },
      data: {
        question,
        answer,
      },
    });

    return faq;
  } catch (error) {
    console.error(error);
    if (error instanceof Prisma.PrismaClientKnownRequestError) {
      throw error;
    }
  }
}

export async function fetchFaqs({
  page,
  pageSize,
  searchText,
}: {
  page: number;
  pageSize: number;
  searchText?: string;
}): Promise<{ faqs: Faq[] | undefined; total: number }> {
  const whereClause: Prisma.FaqWhereInput = {
    ...(searchText && {
      OR: [
        {
          question: {
            contains: searchText,
            mode: "insensitive",
          },
        },
        {
          answer: {
            contains: searchText,
            mode: "insensitive",
          },
        },
      ],
    }),
  };

  const faqs = await prisma.faq.findMany({
    where: whereClause,
    orderBy: {
      created_at: "desc",
    },
    skip: (page - 1) * pageSize,
    take: pageSize,
  });

  const total = await prisma.faq.count({
    where: whereClause,
  });

  return { faqs, total };
}

export async function deleteFaq({
  id,
}: {
  id: string;
}): Promise<Faq | undefined> {
  return await prisma.faq.delete({
    where: {
      id: id,
    },
  });
}
