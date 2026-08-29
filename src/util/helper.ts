import {
  ContributionSystem,
  MembershipLevel,
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

interface ContributionLevels {
  [level: string]: number;
}

// Levels are set as yearly ETB amounts (the official plan), then divided by
// 12 to get the monthly base this object actually stores — Yearly/Quarterly
// are derived from that base via base*12 / base*3 in getMinimumContribution.
const contributionLevels: Record<MembershipType, ContributionLevels> = {
  Individual: {
    Platinum: 10000 / 12,
    Diamond: 80,
    Gold: 7000 / 12,
    Silver: 5000 / 12,
    Bronze: 3000 / 12,
    Standard: 1000 / 12,
  },
  Company: {
    Platinum: 50000 / 12, // minimum only — no fixed ceiling
    Diamond: 6660,
    Gold: 40000 / 12,
    Silver: 30000 / 12,
    Bronze: 20000 / 12,
    Standard: 15000 / 12,
  },
};

export function getMinimumContribution({
  membershipType,
  contributionSystem,
  membershipLevel,
}: {
  membershipType: MembershipType;
  contributionSystem: ContributionSystem;
  membershipLevel: MembershipLevel;
}): number {
  let baseContribution: number;

  // Determine the base contribution using a switch statement
  switch (membershipType) {
    case "Individual":
      switch (membershipLevel) {
        case "Platinum":
          baseContribution = contributionLevels.Individual.Platinum;
          break;
        case "Diamond":
          baseContribution = contributionLevels.Individual.Diamond;
          break;
        case "Gold":
          baseContribution = contributionLevels.Individual.Gold;
          break;
        case "Silver":
          baseContribution = contributionLevels.Individual.Silver;
          break;
        case "Bronze":
          baseContribution = contributionLevels.Individual.Bronze;
          break;
        case "Standard":
          baseContribution = contributionLevels.Individual.Standard;
          break;
        default:
          throw new Error(`Invalid membership level: ${membershipLevel}`);
      }
      break;
    case "Company":
      switch (membershipLevel) {
        case "Platinum":
          baseContribution = contributionLevels.Company.Platinum;
          break;
        case "Diamond":
          baseContribution = contributionLevels.Company.Diamond;
          break;
        case "Gold":
          baseContribution = contributionLevels.Company.Gold;
          break;
        case "Silver":
          baseContribution = contributionLevels.Company.Silver;
          break;
        case "Bronze":
          baseContribution = contributionLevels.Company.Bronze;
          break;
        case "Standard":
          baseContribution = contributionLevels.Company.Standard;
          break;
        default:
          throw new Error(`Invalid membership level: ${membershipLevel}`);
      }
      break;
    default:
      throw new Error(
        "Invalid membership type. Choose 'Individual' or 'Company'."
      );
  }

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
