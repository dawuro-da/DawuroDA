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
  image,
  youtubeLink,
  goalAmount,
  raisedAmount,
  isFeatured,
  isDraft,
  startDate,
  endDate,
}: {
  headline: string;
  headlineAmharic: string;
  description: string;
  image?: string;
  youtubeLink?: string;
  goalAmount?: number;
  raisedAmount?: number;
  isFeatured?: boolean;
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
        image,
        youtubeLink,
        goalAmount,
        raisedAmount,
        isFeatured,
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
  image,
  youtubeLink,
  goalAmount,
  raisedAmount,
  isFeatured,
  isDraft,
  startDate,
  endDate,
  id,
}: {
  id: string;
  headline: string;
  headlineAmharic: string;
  description: string;
  image?: string;
  youtubeLink?: string;
  goalAmount?: number;
  raisedAmount?: number;
  isFeatured?: boolean;
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
        image,
        youtubeLink,
        goalAmount,
        raisedAmount,
        isFeatured,
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
  includeDrafts,
}: {
  page: number;
  pageSize: number;
  searchText?: string;
  includeDrafts?: boolean;
}): Promise<{ campaigns: Campaign[] | undefined; total: number }> {
  const whereClause: Prisma.CampaignWhereInput = {
    ...(!includeDrafts && { isDraft: false }),
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

export async function fetchFeaturedCampaign(): Promise<Campaign | null> {
  const featured = await prisma.campaign.findFirst({
    where: { isDraft: false, isFeatured: true },
    orderBy: { created_at: "desc" },
  });
  if (featured) return featured;

  // No campaign is explicitly marked featured — fall back to the one with
  // the highest fundraising goal.
  return await prisma.campaign.findFirst({
    where: { isDraft: false },
    orderBy: [{ goalAmount: "desc" }, { created_at: "desc" }],
  });
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
