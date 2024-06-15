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
  const prefix = "MEM";
  const randomString = generateRandomString(6);
  const memberId = `${prefix}${randomString}`;
  return memberId;
}

interface ContributionLevels {
  [level: string]: number;
}

const contributionLevels: Record<MembershipType, ContributionLevels> = {
  Individual: {
    Platinum: 100,
    Diamond: 80,
    Gold: 50,
    SilIver: 30,
    Bronze: 10,
  },
  Company: {
    Platinum: 100000,
    Diamond: 80000,
    Gold: 50000,
    Silver: 30000,
    Bronze: 10000,
    Standard: 0,
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
        case "Platinium":
          baseContribution = contributionLevels.Individual.Platinum;
          break;
        case "Diamond":
          baseContribution = contributionLevels.Individual.Diamond;
          break;
        case "Gold":
          baseContribution = contributionLevels.Individual.Gold;
          break;
        case "Siliver":
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
        case "Platinium":
          baseContribution = contributionLevels.Company.Platinum;
          break;
        case "Diamond":
          baseContribution = contributionLevels.Company.Diamond;
          break;
        case "Gold":
          baseContribution = contributionLevels.Company.Gold;
          break;
        case "Siliver":
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
