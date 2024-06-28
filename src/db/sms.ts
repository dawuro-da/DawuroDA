import prisma from "@/lib/prisma";
import { SmsMessage } from "@prisma/client";

export const fetchRecentSmsMessages = async (): Promise<SmsMessage[]> => {
  return await prisma.smsMessage.findMany();
};

export const creatSmsMessage = async ({
  message,
  totalPhones,
}: {
  message: string;
  totalPhones: number;
}) => {
  try {
    return await prisma.smsMessage.create({
      data: {
        message: message,
        totalPhones: totalPhones,
      },
    });
  } catch (err) {
    console.error(err);
    return null;
  }
};
