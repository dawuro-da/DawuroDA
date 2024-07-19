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

export const checkMemberThreeMonth = ({
  createdAt,
  nextDueDate,
}: {
  createdAt: Date;
  nextDueDate: Date;
}) => {
  // Convert the dates to milliseconds
  const createdAtTime = new Date(createdAt).getTime();
  const nextDueDateTime = new Date(nextDueDate).getTime();

  // Calculate the difference in milliseconds
  const differenceInMilliseconds = nextDueDateTime - createdAtTime;

  // Calculate the difference in months (approx)
  const differenceInMonths =
    differenceInMilliseconds / (1000 * 60 * 60 * 24 * 30.44); // 30.44 is the average days in a month

  // Check if the difference is more than or equal to 3 months
  return differenceInMonths >= 3;
};

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
