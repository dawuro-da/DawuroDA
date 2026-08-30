export function getMonthsSince(date: Date): number {
  const today = new Date();
  const yearDiff = today.getFullYear() - date.getFullYear();
  const monthDiff = today.getMonth() - date.getMonth();

  const totalMonths = yearDiff * 12 + monthDiff;

  return totalMonths > 0 ? totalMonths : 0;
}

export function getFormattedDateFromTimestamp(dateString: string) {
  // Create a Date object from the provided date string
  const date = new Date(dateString);

  // Extract the components of the date
  const month = date.toLocaleString("default", { month: "short" }); // Get the short month name (e.g., "Dec")
  const day = date.getDate(); // Get the day of the month
  const year = date.getFullYear(); // Get the full year

  // Format the timestamp string
  const timestamp = `${month} ${day}, ${year}`;

  return timestamp;
}

export function formatNumberToKOrM(num: number) {
  if (num >= 1_000_000) {
    return (num / 1_000_000).toFixed(2) + "M";
  } else if (num >= 1_000) {
    return (num / 1_000).toFixed(2) + "K";
  } else {
    return num.toString();
  }
}

export function getFormattedDate(dateString: Date) {
  // Create a Date object from the provided date string
  const date = new Date(dateString);

  // Format the date using toLocaleDateString with the specified options
  const formattedDate = date.toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  });

  return formattedDate;
}

export function getFormattedMonthAndDay(dateString: Date) {
  // Create a Date object from the provided date string
  const date = new Date(dateString);

  // Format the date using toLocaleDateString with the specified options
  const formattedDate = date.toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
  });

  return formattedDate;
}

export function getFormattedhourAndMinute(dateString: Date) {
  // Create a Date object from the provided date string
  const date = new Date(dateString);

  // Format the date using toLocaleDateString with the specified options
  const formattedHour = date.toLocaleDateString("en-US", {
    hour: "2-digit",
    minute: "2-digit",
  });

  return formattedHour;
}

export function calculateNextDueDate({
  fromDate,
  contributionSystem,
}: {
  fromDate: string | Date;
  contributionSystem: string;
}) {
  const fromDateObj = new Date(fromDate);

  // Calculate the next due date based on the contribution system
  switch (contributionSystem.toLowerCase()) {
    case "monthly":
      // Calculate next month's due date
      const nextMonthDate = new Date(fromDateObj);
      nextMonthDate.setMonth(nextMonthDate.getMonth() + 1);
      return nextMonthDate;
    case "quarterly":
      // Calculate next quarter's due date
      const nextQuarterDate = new Date(fromDateObj);
      nextQuarterDate.setMonth(nextQuarterDate.getMonth() + 3);
      return nextQuarterDate;
    case "yearly":
      // Calculate next year's due date
      const nextYearDate = new Date(fromDateObj);
      nextYearDate.setFullYear(nextYearDate.getFullYear() + 1);
      return nextYearDate;
    default:
      throw new Error(
        "Invalid contribution system. Supported values are 'monthly', 'quarterly', and 'yearly'."
      );
  }
}
export function calculateAge(birthdate: string) {
  // Parse the birthdate into a Date object
  const birthDate = new Date(birthdate);
  const today = new Date();

  // Calculate the difference in years
  let age = today.getFullYear() - birthDate.getFullYear();

  // Adjust if the birth date hasn't occurred yet this year
  const monthDifference = today.getMonth() - birthDate.getMonth();
  const dayDifference = today.getDate() - birthDate.getDate();

  if (monthDifference < 0 || (monthDifference === 0 && dayDifference < 0)) {
    age--;
  }

  return age;
}

const MONTHS_COVERED_BY_SYSTEM: Record<string, number> = {
  Monthly: 1,
  Quarterly: 3,
  Yearly: 12,
};

// Eligibility is based on months actually paid for, not on `nextDueDate -
// createdAt`. That date-arithmetic approach was indirect and inaccurate:
// nextDueDate is set 30 calendar days out per payment while the comparison
// divided by a 30.44-day average, so a member who had genuinely paid for 3
// months landed at ~90 raw days versus a ~91.3 day threshold — just under
// it — and only cleared the bar after a 4th payment pushed nextDueDate
// further out. Summing the months each contribution record actually covers
// (by its contribution system) is exact and has no such rounding edge.
export const checkMemberThreeMonth = ({
  contributions,
}: {
  contributions?: { contributionSystem: string }[];
}) => {
  const totalMonthsPaid = (contributions ?? []).reduce(
    (sum, c) => sum + (MONTHS_COVERED_BY_SYSTEM[c.contributionSystem] ?? 1),
    0
  );
  return totalMonthsPaid >= 3;
};

// Converts a Gregorian date to its Ethiopian calendar year. Ethiopian New
// Year (Meskerem 1) falls on Sept 11 in most years (Sept 12 the year before
// a Gregorian leap year); before that date the Ethiopian year is 8 behind
// the Gregorian one, on/after it's 7 behind.
export function getEthiopianYear(date: Date = new Date()): number {
  const gYear = date.getFullYear();
  const isPreLeapYear = (gYear + 1) % 4 === 0;
  const newYearDay = isPreLeapYear ? 12 : 11;
  const newYearThisGregorianYear = new Date(gYear, 8, newYearDay); // month 8 = September

  return date >= newYearThisGregorianYear ? gYear - 7 : gYear - 8;
}

export function getRelativeTimeSinceDate(dateString: Date) {
  const givenDate = new Date(dateString);
  const now = new Date();
  const diffInMilliseconds = now.getTime() - givenDate.getTime();
  const diffInSeconds = Math.floor(diffInMilliseconds / 1000);
  const diffInMinutes = Math.floor(diffInSeconds / 60);
  const diffInHours = Math.floor(diffInMinutes / 60);
  const diffInDays = Math.floor(diffInHours / 24);
  const diffInWeeks = Math.floor(diffInDays / 7);

  if (diffInWeeks > 0) {
    return diffInWeeks === 1 ? "1 week ago" : `${diffInWeeks} weeks ago`;
  } else if (diffInDays > 0) {
    return diffInDays === 1 ? "1 day ago" : `${diffInDays} days ago`;
  } else if (diffInHours > 0) {
    return diffInHours === 1 ? "1 hour ago" : `${diffInHours} hours ago`;
  } else if (diffInMinutes > 0) {
    return diffInMinutes === 1
      ? "1 minute ago"
      : `${diffInMinutes} minutes ago`;
  } else {
    return diffInSeconds === 1
      ? "1 second ago"
      : `${diffInSeconds} seconds ago`;
  }
}
