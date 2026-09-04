import {
  ContributionSystem,
  MembershipLevelConfig,
  MembershipType,
} from "@prisma/client";
import * as XLSX from "xlsx";

export function generateRandomString(length: number) {
  const characters =
    "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
  let result = "";
  for (let i = 0; i < length; i++) {
    result += characters.charAt(Math.floor(Math.random() * characters.length));
  }
  return result;
}

export function generateMemberId() {
  const prefix = "DaDA";
  const randomString = generateRandomString(8);
  const memberId = `${prefix}${randomString}`;
  return memberId;
}

// Membership levels (and their pricing) are admin-configurable — see
// src/db/membershipLevel.ts and /admin/dashboard/configuration — rather
// than a fixed enum, so the caller passes in the current levels list
// (typically from useMembershipLevels()) and this just does the lookup and
// the monthly/quarterly/yearly derivation that was previously hardcoded per
// level.
export function getMinimumContribution({
  membershipType,
  contributionSystem,
  membershipLevel,
  levels,
}: {
  membershipType: MembershipType;
  contributionSystem: ContributionSystem;
  membershipLevel: string;
  levels: Pick<
    MembershipLevelConfig,
    "name" | "individualYearlyMin" | "companyYearlyMin"
  >[];
}): number {
  const level = levels.find((l) => l.name === membershipLevel);
  if (!level) return 0;

  const yearlyMin =
    membershipType === "Company"
      ? level.companyYearlyMin
      : level.individualYearlyMin;
  const baseContribution = yearlyMin / 12;

  switch (contributionSystem) {
    case "Yearly":
      return baseContribution * 12;
    case "Quarterly":
      return baseContribution * 3;
    default:
      return baseContribution;
  }
}

export const downloadExcel = (data: any, name?: string) => {
  const worksheet = XLSX.utils.json_to_sheet(data);
  const workbook = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(workbook, worksheet, "Sheet1");
  //let buffer = XLSX.write(workbook, { bookType: "xlsx", type: "buffer" });
  //XLSX.write(workbook, { bookType: "xlsx", type: "binary" });
  XLSX.writeFile(workbook, name ? `${name}.csv` : "DataSheet.csv");
};

export function convertYouTubeURL(url: string) {
  const watchPattern = "watch?v=";
  const embedPattern = "embed/";

  if (url.includes(watchPattern)) {
    return url.replace(watchPattern, embedPattern);
  }

  // If the URL doesn't contain "watch?v=", return the original URL
  return url;
}
