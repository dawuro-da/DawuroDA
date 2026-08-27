import prisma from "@/lib/prisma";
import { Prisma, Job } from "@prisma/client";

export async function findJobById(id: string): Promise<Job | null> {
  return await prisma.job.findUnique({
    where: {
      id: id,
    },
  });
}

export async function createJob({
  jobTitle,
  jobDescription,
  jobDescriptionAmharic,
  jobTitleAmharic,
  isDraft,
  document,
  deadlineDate,
}: {
  isDraft: boolean;
  jobTitle: string;
  jobDescription: string;
  jobDescriptionAmharic: string;
  jobTitleAmharic: string;
  document: string;
  deadlineDate: string;
}) {
  try {
    const job = await prisma.job.create({
      data: {
        isDraft,
        jobTitle,
        jobDescription,
        jobDescriptionAmharic,
        jobTitleAmharic,
        document,
        deadlineDate: new Date(deadlineDate),
      },
    });

    return job;
  } catch (error) {
    console.error(error);

    throw error;
  }
}

export async function updateJob({
  jobTitle,
  jobDescription,
  jobDescriptionAmharic,
  jobTitleAmharic,
  id,
  isDraft,
  document,
  deadlineDate,
}: {
  id: string;
  jobTitle: string;
  jobDescription: string;
  jobDescriptionAmharic: string;
  jobTitleAmharic: string;
  isDraft: boolean;
  document: string;
  deadlineDate: string;
}) {
  try {
    const job = await prisma.job.update({
      where: { id: id },
      data: {
        jobTitle,
        isDraft,
        jobDescription,
        jobDescriptionAmharic,
        jobTitleAmharic,
        document,
        deadlineDate: new Date(deadlineDate),
      },
    });

    return job;
  } catch (error) {
    console.error(error);
    throw error;
  }
}

export async function fetchJobs({
  page,
  pageSize,
  searchText,
  includeDrafts,
}: {
  page: number;
  pageSize: number;
  searchText?: string;
  includeDrafts?: boolean;
}): Promise<{ jobs: Job[] | undefined; total: number }> {
  const whereClause: Prisma.JobWhereInput = {
    ...(!includeDrafts && { isDraft: false }),
    ...(searchText && {
      OR: [
        {
          jobTitle: {
            contains: searchText,
            mode: "insensitive",
          },
        },
        {
          jobTitleAmharic: {
            contains: searchText,
            mode: "insensitive",
          },
        },
        {
          jobDescription: {
            contains: searchText,
            mode: "insensitive",
          },
        },
        {
          jobDescriptionAmharic: {
            contains: searchText,
            mode: "insensitive",
          },
        },
      ],
    }),
  };

  const jobs = await prisma.job.findMany({
    where: whereClause,
    orderBy: {
      created_at: "desc",
    },
    skip: (page - 1) * pageSize,
    take: pageSize,
  });

  const total = await prisma.job.count({
    where: whereClause,
  });

  return { jobs, total };
}

export async function fetchActiveJobs({
  page,
  pageSize,
  searchText,
}: {
  page: number;
  pageSize: number;
  searchText?: string;
}): Promise<{ jobs: Job[] | undefined; total: number }> {
  const now = new Date();
  const whereClause: Prisma.JobWhereInput = {
    isDraft: false,
    deadlineDate: {
      gte: now.toISOString(),
    },
    ...(searchText && {
      OR: [
        {
          jobTitle: {
            contains: searchText,
            mode: "insensitive",
          },
        },
        {
          jobTitleAmharic: {
            contains: searchText,
            mode: "insensitive",
          },
        },
        {
          jobDescription: {
            contains: searchText,
            mode: "insensitive",
          },
        },
        {
          jobDescriptionAmharic: {
            contains: searchText,
            mode: "insensitive",
          },
        },
      ],
    }),
  };

  const jobs = await prisma.job.findMany({
    where: whereClause,
    orderBy: {
      created_at: "desc",
    },
    skip: (page - 1) * pageSize,
    take: pageSize,
  });

  const total = await prisma.job.count({
    where: whereClause,
  });

  return { jobs, total };
}

export async function deleteJob({
  id,
}: {
  id: string;
}): Promise<Job | undefined> {
  return await prisma.job.delete({
    where: {
      id: id,
    },
  });
}
