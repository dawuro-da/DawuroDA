// Shared payment-effects functions — the one place a successful payment
// (Chapa or a staff-approved manual bank receipt) actually mutates Member/
// TempMember/Contribution data. Both src/app/api/webhook/payment/route.ts
// and the manual PaymentReceipt approval route call these, so the two
// payment methods can never apply a payment differently. Neither function
// writes an audit log itself — callers do that afterward with whatever
// attribution fits their context (Chapa webhook vs. an approving admin).

import prisma from "@/lib/prisma";
import { Member, TempMember } from "@prisma/client";
import { calculateNextDueDate, getEthiopianYear } from "@/util/date";
import { createContribution } from "@/db/contribution";
import { renewMemberID } from "@/db/member";
import { deleteTempMemberByPhone } from "@/db/tempMember";
import { generateMemberId } from "@/util/helper";

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

// Promotes a paid TempMember into a real Member: copies every field across,
// generates the member's public memberId, deletes the TempMember row, and
// records their first Contribution.
export async function applyRegistrationPayment(
  tempMember: TempMember
): Promise<Member | null> {
  const date = new Date(Date.now());
  const sharedData = {
    email: tempMember.email,
    phone: tempMember.phone,
    membershipLevel: tempMember.membershipLevel,
    contributionSystem: tempMember.contributionSystem,
    hasPaid: true,
    membershipType: tempMember.membershipType,
    region: tempMember.region,
    city: tempMember.city,
    zone: tempMember.zone,
    kebele: tempMember.kebele,
    positionAtWork: tempMember.positionAtWork,
    paymentMeans: tempMember.paymentMeans,
    contributionAmount: tempMember.contributionAmount,
    lastPaidAt: date.toISOString(),
    nextDueDate: calculateNextDueDate({
      fromDate: date,
      contributionSystem: tempMember.contributionSystem,
    })?.toISOString(),
    password_hash: tempMember.password_hash,
    password_salt: tempMember.password_salt,
  };

  const member = await prisma.member.create({
    data: {
      ...sharedData,
      memberId: generateMemberId(),
      firstName: tempMember.firstName,
      lastName: tempMember.lastName,
      country: tempMember.country,
      nationality: tempMember.nationality,
      gender: tempMember.gender,
      educationLevel: tempMember.educationLevel,
      expertise: tempMember.expertise,
      dateOfBirth: tempMember.dateOfBirth,
      workPlace: tempMember.workPlace,
      profileImage: tempMember.profileImage,
      idNumber: tempMember.idNumber,
      branch: tempMember.branch,
      institutionName: tempMember.institutionName,
      headOrRepresentative: tempMember.headOrRepresentative,
      fieldOfWork: tempMember.fieldOfWork,
      partnershipIdea: tempMember.partnershipIdea,
    },
  });

  if (!member) return null;

  await deleteTempMemberByPhone({ phone: tempMember.phone });
  await createContribution({
    contributionSystem: member.contributionSystem,
    contributorId: member.id,
    amount: member.contributionAmount.toString(),
  });

  return member;
}
