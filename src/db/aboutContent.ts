import prisma from "@/lib/prisma";
import { Prisma, AboutContent } from "@prisma/client";

export async function fetchAboutContents({
  includeDrafts,
}: {
  includeDrafts?: boolean;
}): Promise<AboutContent[]> {
  const whereClause: Prisma.AboutContentWhereInput = {
    ...(!includeDrafts && { isDraft: false }),
  };

  return await prisma.aboutContent.findMany({
    where: whereClause,
    orderBy: {
      section: "asc",
    },
  });
}

export async function fetchAboutContentBySection({
  section,
  includeDrafts,
}: {
  section: string;
  includeDrafts?: boolean;
}): Promise<AboutContent | null> {
  return await prisma.aboutContent.findFirst({
    where: {
      section,
      ...(!includeDrafts && { isDraft: false }),
    },
  });
}

export async function upsertAboutContent({
  section,
  title,
  titleAmharic,
  subtitle,
  subtitleAmharic,
  body,
  bodyAmharic,
  items,
  itemsAmharic,
  image,
  isDraft,
}: {
  section: string;
  title: string;
  titleAmharic: string;
  subtitle: string;
  subtitleAmharic: string;
  body: string;
  bodyAmharic: string;
  items?: string[];
  itemsAmharic?: string[];
  image?: string;
  isDraft: boolean;
}) {
  try {
    const data = {
      title,
      titleAmharic,
      subtitle,
      subtitleAmharic,
      body,
      bodyAmharic,
      ...(items && { items }),
      ...(itemsAmharic && { itemsAmharic }),
      ...(image && { image }),
      isDraft,
    };

    return await prisma.aboutContent.upsert({
      where: { section },
      update: data,
      create: { section, ...data },
    });
  } catch (error) {
    console.error(error);
    if (error instanceof Prisma.PrismaClientKnownRequestError) {
      throw error;
    }
  }
}
