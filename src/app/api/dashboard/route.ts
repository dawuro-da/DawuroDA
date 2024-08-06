import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { UserRole } from "@prisma/client";
import { OPTIONS } from "@/util/authOptions";
import prisma from "@/lib/prisma";

const getLastMonthStartAndEnd = () => {
  const now = new Date();
  const startOfCurrentMonth = new Date(now.getFullYear(), now.getMonth(), 1);

  // Calculate the start of last month
  const startOfLastMonth = new Date(startOfCurrentMonth);
  startOfLastMonth.setMonth(startOfCurrentMonth.getMonth() - 1);

  // If the startOfLastMonth calculation set the month to December of the previous year,
  // adjust the year accordingly.
  if (startOfLastMonth.getMonth() === 11) {
    startOfLastMonth.setFullYear(startOfCurrentMonth.getFullYear() - 1);
  }

  // Calculate the end of last month (the day before the start of the current month)
  const endOfLastMonth = new Date(startOfCurrentMonth);
  endOfLastMonth.setDate(0);

  return {
    startOfLastMonth,
    endOfLastMonth,
  };
};

export async function GET(req: Request) {
  const session = await getServerSession(OPTIONS);
  if (!session?.user?.id || session.user.role === UserRole.Member) {
    return NextResponse.redirect("/gaadmin/login", 401);
  }

  try {
    const sevenDaysBeforeNow = new Date(Date.now() - 7 * 24 * 60 * 60 * 1000);
    const { startOfLastMonth, endOfLastMonth } = getLastMonthStartAndEnd();

    const totalMembers = await prisma.member.count();
    const memberSinceLastWeek = await prisma.member.count({
      where: {
        created_at: {
          gte: sevenDaysBeforeNow,
        },
      },
    });

    const donations = (
      await prisma.generalDonation.aggregate({
        _sum: {
          amount: true,
        },
      })
    )._sum.amount;

    const donationsSinceLastWeek = await prisma.generalDonation.count({
      where: {
        created_at: {
          gte: sevenDaysBeforeNow,
        },
      },
    });

    const totalContributions = (
      await prisma.contribution.aggregate({
        _sum: {
          amount: true,
        },
      })
    )._sum.amount;

    const contributionsLastMonth = (
      await prisma.contribution.aggregate({
        where: {
          created_at: {
            gte: startOfLastMonth,
            lte: endOfLastMonth,
          },
        },
        _sum: {
          amount: true,
        },
      })
    )._sum.amount;

    const contributionsCurrentMonth = (
      await prisma.contribution.aggregate({
        where: {
          created_at: {
            gte: endOfLastMonth,
          },
        },
        _sum: {
          amount: true,
        },
      })
    )._sum.amount;

    let contributionStatus = getContributionStatus(
      contributionsCurrentMonth,
      contributionsLastMonth
    );

    const lineChartData = await getMemberRegistrationsByMonth();
    const pieChartData = await getTotalMembersStatus();
    const result = {
      totalMember: totalMembers,
      memberSinceLastWeek: memberSinceLastWeek,
      totalContributions: totalContributions ? totalContributions : 0,
      contributionStatus: contributionStatus
        ? contributionStatus
        : { percentage: 0, isIncreased: false },
      donations: donations ? donations : 0,
      donationsSinceLastWeek: donationsSinceLastWeek
        ? donationsSinceLastWeek
        : 0,
      pieChartData,
      lineChartData,
    };

    if (result) {
      return NextResponse.json(
        { success: true, value: result },
        { status: 200 }
      );
    }
  } catch (err) {
    console.warn(err);
    return NextResponse.json(
      {
        success: false,
        error: "Unable to fetch dashboard data",
      },
      { status: 500 }
    );
  }
}

const getContributionStatus = (
  contributionsCurrentMonth: number | null,
  contributionsLastMonth: number | null
) => {
  contributionsCurrentMonth = contributionsCurrentMonth ?? 0;
  contributionsLastMonth = contributionsLastMonth ?? 0;

  let contributionStatus = {
    percentage: 0,
    isIncreased: false,
  };
  if (contributionsCurrentMonth > contributionsLastMonth) {
    const denominator = contributionsLastMonth ? contributionsLastMonth : 1;
    const percentage =
      ((contributionsCurrentMonth - contributionsLastMonth) / denominator) *
      100;
    contributionStatus = {
      percentage: parseFloat(percentage.toFixed(2)),
      isIncreased: true,
    };
  } else if (contributionsLastMonth > contributionsCurrentMonth) {
    const denominator = contributionsCurrentMonth
      ? contributionsCurrentMonth
      : 1;
    const percentage =
      ((contributionsLastMonth - contributionsCurrentMonth) / denominator) *
      100;

    contributionStatus = {
      percentage: parseFloat(percentage.toFixed(2)),
      isIncreased: false,
    };
  }

  return contributionStatus;
};

async function getMemberRegistrationsByMonth() {
  const result = await prisma.$queryRaw<any[]>`
    SELECT 
      TO_CHAR("created_at", 'Mon') AS name,
      COUNT(*) AS pv,
      COUNT(*) AS amt
    FROM "members"
    WHERE EXTRACT(YEAR FROM "created_at") = EXTRACT(YEAR FROM CURRENT_DATE)
    GROUP BY TO_CHAR("created_at", 'Mon')
    ORDER BY TO_DATE(TO_CHAR("created_at", 'Mon'), 'Mon');
  `;

  if (result.length > 0) {
    return result.map((item) => ({
      name: item.name,
      pv: parseInt(item.pv, 10),
      amt: parseInt(item.amt, 10),
    }));
  } else {
    return [{ name: "", pv: 0, amt: 0 }];
  }
}

const getTotalMembersStatus = async () => {
  const totalMemberCount = await prisma.member.count();
  const totalMemberPaid = await prisma.member.count({
    where: { hasPaid: true },
  });

  return {
    totalMemberCount,
    totalMemberPaid,
    totalMemberUnpaid: totalMemberCount - totalMemberPaid,
  };
};
