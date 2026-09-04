import prisma from "@/lib/prisma";
import { BankAccount } from "@prisma/client";

export async function fetchBankAccounts({
  activeOnly,
}: {
  activeOnly?: boolean;
} = {}): Promise<BankAccount[]> {
  return await prisma.bankAccount.findMany({
    where: activeOnly ? { isActive: true } : undefined,
    orderBy: { sortOrder: "asc" },
  });
}

export async function findBankAccountById(
  id: string
): Promise<BankAccount | null> {
  return await prisma.bankAccount.findUnique({ where: { id } });
}

export async function createBankAccount(data: {
  bankName: string;
  accountNumber: string;
  accountHolderName?: string;
  logo?: string;
  sortOrder?: number;
}): Promise<BankAccount> {
  return await prisma.bankAccount.create({ data });
}

export async function updateBankAccount({
  id,
  data,
}: {
  id: string;
  data: {
    bankName?: string;
    accountNumber?: string;
    accountHolderName?: string;
    logo?: string;
    isActive?: boolean;
    sortOrder?: number;
  };
}): Promise<BankAccount> {
  return await prisma.bankAccount.update({ where: { id }, data });
}

// Hard delete is safe here — PaymentReceipt stores bankName as a plain
// string snapshot, not a foreign key, so removing a bank never orphans a
// historical receipt.
export async function deleteBankAccount(id: string): Promise<BankAccount> {
  return await prisma.bankAccount.delete({ where: { id } });
}
