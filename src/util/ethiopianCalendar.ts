// Ethiopian <-> Gregorian calendar conversion, via Julian Day Number (JDN) —
// the standard, calendar-agnostic approach used by every correct
// implementation of this conversion (see "Calendrical Calculations" by
// Reingold & Dershowitz, and the Ethiopian calendar's documented JDN epoch).
//
// The Ethiopian calendar has 13 months: 12 of 30 days, plus Pagume, a 13th
// month of 5 days (6 in an Ethiopian leap year). An Ethiopian leap year is
// one where (year % 4 === 3) — the year immediately before the Gregorian
// leap year it overlaps with, since Ethiopian New Year falls in September.

export const ETHIOPIAN_MONTHS = [
  "Meskerem",
  "Tikimt",
  "Hidar",
  "Tahsas",
  "Tir",
  "Yekatit",
  "Megabit",
  "Miazia",
  "Ginbot",
  "Sene",
  "Hamle",
  "Nehase",
  "Pagume",
] as const;

export const ETHIOPIAN_MONTHS_AMHARIC = [
  "መስከረም",
  "ጥቅምት",
  "ኅዳር",
  "ታኅሳስ",
  "ጥር",
  "የካቲት",
  "መጋቢት",
  "ሚያዝያ",
  "ግንቦት",
  "ሰኔ",
  "ሐምሌ",
  "ነሐሴ",
  "ጳጉሜ",
] as const;

const JDN_EPOCH_OFFSET_AMETE_MIHRET = 1723856;

export const isEthiopianLeapYear = (ethYear: number): boolean =>
  ethYear % 4 === 3;

export const daysInEthiopianMonth = (
  ethYear: number,
  ethMonth: number
): number => {
  if (ethMonth < 1 || ethMonth > 13) return 30;
  if (ethMonth === 13) return isEthiopianLeapYear(ethYear) ? 6 : 5;
  return 30;
};

const gregorianToJdn = (year: number, month: number, day: number): number => {
  const s = year < 0 ? 1 : 0;
  const a = Math.floor((14 - month) / 12);
  const y = year + 4800 - a - s;
  const m = month + 12 * a - 3;
  return (
    day +
    Math.floor((153 * m + 2) / 5) +
    365 * y +
    Math.floor(y / 4) -
    Math.floor(y / 100) +
    Math.floor(y / 400) -
    32045
  );
};

const jdnToGregorian = (
  jdn: number
): { year: number; month: number; day: number } => {
  const l1 = jdn + 68569;
  const n = Math.floor((4 * l1) / 146097);
  const l2 = l1 - Math.floor((146097 * n + 3) / 4);
  const i = Math.floor((4000 * (l2 + 1)) / 1461001);
  const l3 = l2 - Math.floor((1461 * i) / 4) + 31;
  const j = Math.floor((80 * l3) / 2447);
  const day = l3 - Math.floor((2447 * j) / 80);
  const l4 = Math.floor(j / 11);
  const month = j + 2 - 12 * l4;
  const year = 100 * (n - 49) + i + l4;
  return { year, month, day };
};

const ethiopianToJdn = (
  year: number,
  month: number,
  day: number
): number => {
  return (
    JDN_EPOCH_OFFSET_AMETE_MIHRET +
    365 * year +
    Math.floor(year / 4) +
    30 * month +
    day -
    31
  );
};

const jdnToEthiopian = (
  jdn: number
): { year: number; month: number; day: number } => {
  const r = (jdn - JDN_EPOCH_OFFSET_AMETE_MIHRET) % 1461;
  const n = (r % 365) + 365 * Math.floor(r / 1460);
  const year =
    4 * Math.floor((jdn - JDN_EPOCH_OFFSET_AMETE_MIHRET) / 1461) +
    Math.floor(r / 365) -
    Math.floor(r / 1460);
  const month = Math.floor(n / 30) + 1;
  const day = (n % 30) + 1;
  return { year, month, day };
};

export interface EthiopianDate {
  year: number;
  month: number; // 1-13
  day: number;
}

// Converts a Gregorian JS Date (interpreted in local time, date-only) to its
// Ethiopian calendar equivalent.
export const gregorianToEthiopian = (date: Date): EthiopianDate => {
  const jdn = gregorianToJdn(
    date.getFullYear(),
    date.getMonth() + 1,
    date.getDate()
  );
  return jdnToEthiopian(jdn);
};

// Converts an Ethiopian calendar date to the equivalent Gregorian JS Date
// (local midnight).
export const ethiopianToGregorian = (
  year: number,
  month: number,
  day: number
): Date => {
  const jdn = ethiopianToJdn(year, month, day);
  const { year: gYear, month: gMonth, day: gDay } = jdnToGregorian(jdn);
  return new Date(gYear, gMonth - 1, gDay);
};

// Formats an Ethiopian date as "DD Month YYYY" (English month names) or
// using the Amharic month names when `amharic` is true.
export const formatEthiopianDate = (
  ethDate: EthiopianDate,
  amharic = false
): string => {
  const months = amharic ? ETHIOPIAN_MONTHS_AMHARIC : ETHIOPIAN_MONTHS;
  const monthName = months[ethDate.month - 1] ?? "";
  return `${ethDate.day} ${monthName} ${ethDate.year}`;
};
