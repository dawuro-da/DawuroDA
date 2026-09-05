// Shared payment-effects functions — the one place a successful payment
// (Chapa or a staff-approved manual bank receipt) actually mutates Member/
// Contribution data. Both src/app/api/webhook/payment/route.ts and the
// manual PaymentReceipt approval route call these, so the two payment
// methods can never apply a payment differently. Neither function writes an
// audit log itself — callers do that afterward with whatever attribution
// fits their context (Chapa webhook vs. an approving admin).

import prisma from "@/lib/prisma";
import { Member } from "@prisma/client";
import { calculateNextDueDate, getEthiopianYear } from "@/util/date";
import { createContribution } from "@/db/contribution";
import { renewMemberID } from "@/db/member";

// Records a recurring contribution for an existing member: creates the
// Contribution row, advances nextDueDate by one billing period from the
// member's *current* due date (so it stacks correctly whether paid early or
// late), and renews the membership ID for the current Ethiopian year.
export async function applyContributionPayment(
  member: Member,
  amount: string | number
) {
  const contribution = await createContribution({
    contributionSystem: member.contributionSystem,
    contributorId: member.id,
    amount: amount.toString(),
  });

  const nextDueDate = calculateNextDueDate({
    fromDate: member.nextDueDate,
    contributionSystem: member.contributionSystem,
  });

  await prisma.member.update({
    where: { id: member.id },
    data: { nextDueDate },
  });
  await renewMemberID({
    memberId: member.id,
    ethiopianYear: getEthiopianYear(),
  });

  return contribution;
}

// Confirms a member's first (registration) payment: flips hasPaid to true,
// resets lastPaidAt/nextDueDate from today, and records their first
// Contribution. The Member row itself already exists — created unpaid at
// signup submit time (see src/app/api/tempMember/register/route.ts) — so
// this only ever updates, never creates. Idempotent against duplicate calls
// (a re-delivered Chapa webhook, e.g.) since a second call on an
// already-paid member is a no-op rather than a double Contribution.
export async function applyRegistrationPayment(
  member: Member
): Promise<Member | null> {
  if (member.hasPaid) return member;

  const date = new Date(Date.now());
  const nextDueDate = calculateNextDueDate({
    fromDate: date,
    contributionSystem: member.contributionSystem,
  });

  const updated = await prisma.member.update({
    where: { id: member.id },
    data: {
      hasPaid: true,
      lastPaidAt: date,
      nextDueDate,
    },
  });

  await createContribution({
    contributionSystem: updated.contributionSystem,
    contributorId: updated.id,
    amount: updated.contributionAmount.toString(),
  });

  return updated;
}
