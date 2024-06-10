import prisma from "@/lib/prisma";
import { ContributionSystem, Prisma } from "@prisma/client";

export async function createContribution({
  contributionSystem,
  contributorId,
  amount,
}: {
  contributionSystem: ContributionSystem;
  contributorId: string;
  amount: string;
}) {
  try {
    const contribution = await prisma.contribution.create({
      data: { contributionSystem, contributorId, amount: parseFloat(amount) },
    });

    return contribution;
  } catch (error) {
    console.error(error);

    if (error instanceof Prisma.PrismaClientKnownRequestError) {
      throw error;
    }
  }
}

export async function findContributionsByContributorId({
  contributorId,
}: {
  contributorId: string;
}) {
  try {
    const contribution = await prisma.contribution.findMany({
      where: { contributorId },
      orderBy: {
        created_at: "desc",
      },
      take: 12,
    });

    return contribution;
  } catch (error) {
    console.error(error);

    if (error instanceof Prisma.PrismaClientKnownRequestError) {
      throw error;
    }
  }
}
