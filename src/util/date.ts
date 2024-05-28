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
