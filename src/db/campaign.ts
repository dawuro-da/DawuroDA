import prisma from "@/lib/prisma";
import { Prisma, Campaign } from "@prisma/client";

export async function findCampaignById(id: string): Promise<Campaign | null> {
  return await prisma.campaign.findUnique({
    where: {
      id: id,
    },
  });
}

export async function createCampaign({
  headline,
  headlineAmharic,
  description,
  isDraft,
  startDate,
  endDate,
}: {
  headline: string;
  headlineAmharic: string;
  description: string;
  isDraft: boolean;
  startDate: string;
  endDate: string;
}) {
  try {
    const campaign = await prisma.campaign.create({
      data: {
        headline,
        headlineAmharic,
        description,
        isDraft,
        startDate,
        endDate,
      },
    });

    return campaign;
  } catch (error) {
    console.error(error);

    if (error instanceof Prisma.PrismaClientKnownRequestError) {
      throw error;
    }
  }
}

export async function updateCampaign({
  headline,
  headlineAmharic,
  description,
  isDraft,
  startDate,
  endDate,
  id,
}: {
  id: string;
  headline: string;
  headlineAmharic: string;
  description: string;
  isDraft: boolean;
  startDate: string;
  endDate: string;
}) {
  try {
    const campaign = await prisma.campaign.update({
      where: { id: id },
      data: {
        headline,
        headlineAmharic,
        isDraft,
        description,
        startDate: new Date(startDate).toISOString(),
        endDate: new Date(endDate).toISOString(),
      },
    });

    return campaign;
  } catch (error) {
    console.error(error);
    if (error instanceof Prisma.PrismaClientKnownRequestError) {
      throw error;
    }
  }
}

export async function fetchCampaigns({
  page,
  pageSize,
  searchText,
}: {
  page: number;
  pageSize: number;
  searchText?: string;
}): Promise<{ campaigns: Campaign[] | undefined; total: number }> {
  const whereClause: Prisma.CampaignWhereInput = {
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
          description: {
            contains: searchText,
            mode: "insensitive",
          },
        },
      ],
    }),
  };

  const campaigns = await prisma.campaign.findMany({
    where: whereClause,
    orderBy: {
      created_at: "desc",
    },
    skip: (page - 1) * pageSize,
    take: pageSize,
  });

  const total = await prisma.campaign.count({
    where: whereClause,
  });

  return { campaigns, total };
}

export async function deleteCampaign({
  id,
}: {
  id: string;
}): Promise<Campaign | undefined> {
  return await prisma.campaign.delete({
    where: {
      id: id,
    },
  });
}
