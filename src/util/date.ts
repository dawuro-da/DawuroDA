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
