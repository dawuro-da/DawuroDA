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
  questionAmharic,
  answer,
  answerAmharic,
  isDraft,
}: {
  question: string;
  questionAmharic: string;
  answer: string;
  answerAmharic: string;
  isDraft: boolean;
}) {
  try {
    const faq = await prisma.faq.create({
      data: {
        question,
        questionAmharic,
        answer,
        answerAmharic,
        isDraft,
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
  questionAmharic,
  answer,
  answerAmharic,
  id,
  isDraft,
}: {
  id: string;
  question: string;
  questionAmharic: string;
  answer: string;
  answerAmharic: string;
  isDraft: boolean;
}) {
  try {
    const faq = await prisma.faq.update({
      where: { id: id },
      data: {
        question,
        questionAmharic,
        answer,
        answerAmharic,
        isDraft,
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
  includeDrafts,
}: {
  page: number;
  pageSize: number;
  searchText?: string;
  includeDrafts?: boolean;
}): Promise<{ faqs: Faq[] | undefined; total: number }> {
  const whereClause: Prisma.FaqWhereInput = {
    ...(!includeDrafts && { isDraft: false }),
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
