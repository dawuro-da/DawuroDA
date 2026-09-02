// Chapa's transaction/initialize endpoint validates `customization.title`
// (max 16 chars) and `customization.description` (max 50 chars, and only
// letters, numbers, hyphens, underscores, spaces and dots — no "&", quotes,
// commas, etc.) and REJECTS the whole request if either is violated. Since
// campaign headlines and donation designations are free-form admin-entered
// text, they need to be sanitized and truncated before being used here.
export const sanitizeChapaText = (text: string, maxLength: number): string => {
  const cleaned = text
    .replace(/&/g, "and")
    .replace(/[^A-Za-z0-9\-_. ]/g, "")
    .replace(/\s+/g, " ")
    .trim();
  return cleaned.length > maxLength
    ? cleaned.slice(0, maxLength).trim()
    : cleaned;
};
