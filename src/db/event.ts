import prisma from "@/lib/prisma";
import { Prisma, Event } from "@prisma/client";

export async function findEventById(id: string): Promise<Event | null> {
  return await prisma.event.findUnique({
    where: {
      id: id,
    },
  });
}

export async function createEvent({
  headline,
  headlineAmharic,
  profileImage,
  body,
  bodyAmharic,
  isDraft,
  startDate,
  endDate,
}: {
  headline: string;
  headlineAmharic: string;
  profileImage: string;
  body: string;
  bodyAmharic: string;
  isDraft: boolean;
  startDate: string;
  endDate: string;
}) {
  try {
    const event = await prisma.event.create({
      data: {
        headline,
        headlineAmharic,
        profileImage,
        body,
        bodyAmharic,
        isDraft,
        startDate: new Date(startDate).toISOString(),
        endDate: new Date(endDate).toISOString(),
      },
    });

    return event;
  } catch (error) {
    console.error(error);

    if (error instanceof Prisma.PrismaClientKnownRequestError) {
      throw error;
    }
  }
}

export async function updateEvent({
  headline,
  headlineAmharic,
  profileImage,
  body,
  bodyAmharic,
  isDraft,
  startDate,
  endDate,
  id,
}: {
  id: string;
  headline: string;
  headlineAmharic: string;
  profileImage: string;
  body: string;
  bodyAmharic: string;
  isDraft: boolean;
  startDate: string;
  endDate: string;
}) {
  try {
    const event = await prisma.event.update({
      where: { id: id },
      data: {
        headline,
        headlineAmharic,
        profileImage,
        body,
        bodyAmharic,
        startDate: new Date(startDate).toISOString(),
        endDate: new Date(endDate).toISOString(),
        isDraft,
      },
    });

    return event;
  } catch (error) {
    console.error(error);
    if (error instanceof Prisma.PrismaClientKnownRequestError) {
      throw error;
    }
  }
}

export async function fetchEvents({
  page,
  pageSize,
  searchText,
  upcoming,
  includeDrafts,
}: {
  page: number;
  pageSize: number;
  searchText?: string;
  upcoming?: boolean;
  includeDrafts?: boolean;
}): Promise<{ events: Event[] | undefined; total: number }> {
  const now = new Date();
  const whereClause: Prisma.EventWhereInput = {
    ...(!includeDrafts && { isDraft: false }),
    ...(upcoming && {
      startDate: {
        gt: now.toISOString(),
      },
    }),
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

  const events = await prisma.event.findMany({
    where: whereClause,
    orderBy: {
      created_at: "desc",
    },
    skip: (page - 1) * pageSize,
    take: pageSize,
  });

  const total = await prisma.event.count({
    where: whereClause,
  });

  return { events, total };
}

export async function deleteEvent({
  id,
}: {
  id: string;
}): Promise<Event | undefined> {
  return await prisma.event.delete({
    where: {
      id: id,
    },
  });
}
