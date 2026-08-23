import { ContactUs, Subscriber, User } from "@prisma/client";

export type DashboardData = {
  totalMember: number;
  totalInvitedMember: number;
  totalConfirmedMember: number;
  totalGateAgents: number;
};

export interface DawuroDAState {
  contactUs: User[];
  subscriber: DashboardData;
}

export interface ContactSlice {
  contactUs: ContactUs[];
  subscriber: Subscriber[];
}
