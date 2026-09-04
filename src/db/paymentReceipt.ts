import prisma from "@/lib/prisma";
import { PaymentReceipt, PaymentReceiptStatus, PaymentReceiptType } from "@prisma/client";

export async function createPaymentReceipt(data: {
  phone: string;
  fullName: string;
  paymentType: PaymentReceiptType;
  bankName: string;
  amount: number;
  receiptReferenceNumber: string;
  memberId?: string;
}): Promise<PaymentReceipt> {
  return await prisma.paymentReceipt.create({ data });
}

export async function findPaymentReceiptById(
  id: string
): Promise<PaymentReceipt | null> {
  return await prisma.paymentReceipt.findUnique({ where: { id } });
}

export async function fetchPaymentReceipts({
  page = 1,
  pageSize = 20,
  status,
}: {
  page?: number;
  pageSize?: number;
  status?: PaymentReceiptStatus;
}) {
  const where = status ? { status } : {};
  const [receipts, total] = await Promise.all([
    prisma.paymentReceipt.findMany({
      where,
      orderBy: { created_at: "desc" },
      skip: (page - 1) * pageSize,
      take: pageSize,
    }),
    prisma.paymentReceipt.count({ where }),
  ]);
  return { receipts, total, page, pageSize };
}

export async function markPaymentReceiptApproved({
  id,
  memberId,
  reviewedById,
  reviewedByName,
}: {
  id: string;
  memberId: string;
  reviewedById: string;
  reviewedByName: string;
}): Promise<PaymentReceipt> {
  return await prisma.paymentReceipt.update({
    where: { id },
    data: {
      status: PaymentReceiptStatus.Approved,
      memberId,
      reviewedById,
      reviewedByName,
      reviewedAt: new Date(),
    },
  });
}

export async function markPaymentReceiptRejected({
  id,
  rejectionReason,
  reviewedById,
  reviewedByName,
}: {
  id: string;
  rejectionReason?: string;
  reviewedById: string;
  reviewedByName: string;
}): Promise<PaymentReceipt> {
  return await prisma.paymentReceipt.update({
    where: { id },
    data: {
      status: PaymentReceiptStatus.Rejected,
      rejectionReason,
      reviewedById,
      reviewedByName,
      reviewedAt: new Date(),
    },
  });
}
