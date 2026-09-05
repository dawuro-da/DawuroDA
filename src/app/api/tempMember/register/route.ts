import { NextResponse } from "next/server";
import bcrypt from "bcrypt";
import {
  ContributionSystem,
  EducationLevel,
  Gender,
  MembershipType,
  PaymentMeans,
} from "@prisma/client";
import { calculateNextDueDate } from "@/util/date";
import { uploadFile } from "@/util/uploadFile";
import {
  createIndividualMember,
  createInstitutionMember,
  findMemberByPhone,
  updateIndividualMember,
  updateInstitutionMember,
} from "@/db/member";
import { generateMemberId } from "@/util/helper";
import { createAuditLog } from "@/db/auditLog";

async function hashPassword(
  password: string,
  salt: string
): Promise<string | null> {
  try {
    return await bcrypt.hash(password, salt);
  } catch (error) {
    console.error(error);
    return null;
  }
}

// A Member row is created here immediately, as unpaid — not after a Chapa
// webhook fires. Waiting for the webhook meant a slow/failed callback (a
// misconfigured env var, a network blip, Chapa never calling back) left the
// signup with no record at all: "I paid but nothing happened." Now every
// completed signup form produces a real, listable Member (hasPaid: false)
// synchronously; the Chapa webhook or an approved bank-transfer receipt (see
// src/db/payment.ts, applyRegistrationPayment) just flips hasPaid to true on
// this same row afterward. This endpoint no longer initiates a Chapa
// transaction itself — that choice belongs to the signup success screen's
// PaymentMethodModal (src/components/shared/PaymentMethodModal.tsx), which
// calls /api/payment/registrationPayment for the Chapa path.
export async function POST(req: Request) {
  const formData = await req.formData();

  const email = formData.get("email") as string;
  const phone = formData.get("phone") as string;
  const membershipLevel = formData.get("membershipLevel") as string;
  const contributionAmount = formData.get("contributionAmount") as string;
  const contributionSystem = formData.get(
    "contributionSystem"
  ) as ContributionSystem;
  const region = formData.get("region") as string;
  const city = formData.get("city") as string;
  const zone = formData.get("zone") as string;
  const kebele = formData.get("kebele") as string;
  const positionAtWork = formData.get("positionAtWork") as string;
  const paymentMeans = formData.get("paymentMeans") as PaymentMeans;
  const membershipType = formData.get("membershipType") as MembershipType;
  const firstName = formData.get("firstName") as string;
  const lastName = formData.get("lastName") as string;
  const gender = formData.get("gender") as Gender;
  const expertise = formData.get("expertise") as string;
  const dateOfBirth = formData.get("dateOfBirth") as string;
  const institutionName = formData.get("institutionName") as string;
  const headOrRepresentative = formData.get("headOrRepresentative") as string;
  const fieldOfWork = formData.get("fieldOfWork") as string;
  const partnershipIdea = formData.get("partnershipIdea") as string;
  const educationLevel = formData.get("educationLevel") as EducationLevel;
  const workPlace = formData.get("workPlace") as string;
  const profileImage = formData.get("profileImage") as File;
  const idNumber = formData.get("idNumber") as string;
  const password = formData.get("password") as string;
  const branch = formData.get("branch") as string;
  const country = formData.get("country") as string;
  const nationality = formData.get("nationality") as string;

  try {
    const existing = await findMemberByPhone(phone);
    if (existing?.hasPaid) {
      return NextResponse.json(
        {
          success: false,
          error:
            "This phone number is already a registered member. Please log in instead.",
        },
        { status: 409 }
      );
    }

    const saltRounds = 10;
    const salt = await bcrypt.genSalt(saltRounds);
    const hashedPassword = await hashPassword(password, salt);

    if (!hashedPassword)
      return NextResponse.json(
        {
          success: false,
          error: "Unable to create member ( password issue)",
        },
        { status: 500 }
      );

    const date = new Date(Date.now());

    const sharedMember = {
      email,
      phone,
      membershipLevel,
      contributionSystem,
      hasPaid: false,
      region,
      city,
      zone,
      kebele,
      positionAtWork,
      paymentMeans,
      contributionAmount: parseInt(contributionAmount),
      lastPaidAt: date.toISOString(),
      membershipType,
      nextDueDate: calculateNextDueDate({
        fromDate: date,
        contributionSystem,
      })?.toISOString(),
      password_hash: hashedPassword,
      password_salt: salt,
    };

    let imageUrl = existing?.profileImage || "/icons/avatar.svg";
    if (profileImage && profileImage.size > 0) {
      imageUrl =
        (await uploadFile({
          path: "/profileImages",
          fileName: profileImage.name ?? "name",
          file: profileImage,
          mimeType: profileImage.type,
        })) ?? imageUrl;
    }

    let result;
    if (existing) {
      // An unpaid member re-submitting the form (e.g. they abandoned payment
      // last time and came back) — update the same row instead of hitting
      // the unique phone constraint or creating a duplicate.
      if (membershipType === MembershipType.Individual) {
        result = await updateIndividualMember({
          id: existing.id,
          memberData: {
            ...sharedMember,
            firstName,
            lastName,
            gender,
            country,
            nationality,
            educationLevel,
            expertise,
            dateOfBirth,
            workPlace,
            profileImage: imageUrl,
            idNumber,
            branch,
          },
        });
      } else {
        result = await updateInstitutionMember({
          id: existing.id,
          memberData: {
            ...sharedMember,
            institutionName,
            headOrRepresentative,
            fieldOfWork,
            partnershipIdea,
          },
        });
      }
    } else {
      const memberId = generateMemberId();
      if (membershipType === MembershipType.Individual) {
        result = await createIndividualMember({
          individualData: {
            ...sharedMember,
            memberId,
            firstName,
            lastName,
            gender,
            country,
            nationality,
            educationLevel,
            expertise,
            dateOfBirth,
            workPlace,
            profileImage: imageUrl,
            idNumber,
            branch,
          },
        });
      } else if (membershipType === MembershipType.Company) {
        result = await createInstitutionMember({
          institutionData: {
            ...sharedMember,
            memberId,
            institutionName,
            headOrRepresentative,
            fieldOfWork,
            partnershipIdea,
          },
        });
      }
    }

    if (!result) {
      return NextResponse.json(
        { success: false, error: "Unable to create member" },
        { status: 500 }
      );
    }

    if (!existing) {
      await createAuditLog({
        entityType: "Member",
        entityId: result.id,
        entityLabel:
          result.institutionName ||
          `${result.firstName ?? ""} ${result.lastName ?? ""}`.trim() ||
          "Unknown",
        action: "CREATE",
        changes: {
          membershipLevel: { from: null, to: result.membershipLevel },
          hasPaid: { from: null, to: false },
        },
        performedByName: "Self-registration",
        performedByRole: "System",
      });
    }

    return NextResponse.json(
      { success: true, value: result },
      { status: 200 }
    );
  } catch (err) {
    console.warn(err);
    return NextResponse.json(
      {
        success: false,
        error: "Unable to create member",
      },
      { status: 500 }
    );
  }
}
