import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { MembershipType, UserRole } from "@prisma/client";
import {
  findMemberByEmail,
  findMemberByPhone,
  updateIndividualMember,
  updateInstitutionMember,
} from "@/db/member";
import { OPTIONS } from "@/util/authOptions";

export async function POST(req: Request, context: { params: { id: string } }) {
  const session = await getServerSession(OPTIONS);
  if (!session?.user.id || session?.user.role === UserRole.Member ) {
    return NextResponse.json(
      { success: false, error: "Unauthorized user" },
      { status: 401 }
    );
  }
  const {
    email,
    phone,
    membershipLevel,
    contributionAmount,
    contributionSystem,
    hasPaid,
    region,
    city,
    zone,
    kebele,
    positionAtWork,
    paymentMeans,
    membershipType,
    firstName,
    lastName,
    gender,
    expertise,
    dateOfBirth,
    institutionName,
    headOrRepresentative,
    fieldOfWork,
    partnershipIdea,
    educationLevel,
    workPlace,
    profileImage,
    idNumber,
    branch,
  } = await req.json();
  const memberId = context.params.id;

  const emailExist = await findMemberByEmail(email);
  const phoneExist = await findMemberByPhone(phone);

  if (emailExist) {
    if (emailExist.id !== memberId) {
      return NextResponse.json(
        {
          success: false,
          error: "Email already exist",
        },
        { status: 409 }
      );
    }
  } else if (phoneExist) {
    if (phoneExist.id !== memberId) {
      return NextResponse.json(
        {
          success: false,
          error: "Phone already exist",
        },
        { status: 409 }
      );
    }
  }

  try {
    const sharedMember = {
      email,
      phone,
      membershipLevel,
      contributionSystem,
      hasPaid,
      region,
      city,
      zone,
      kebele,
      positionAtWork,
      paymentMeans,
      contributionAmount: parseInt(contributionAmount),
      membershipType,
    };

    let result;
    if (membershipType === MembershipType.Individual) {
      result = await updateIndividualMember({
        memberData: {
          ...sharedMember,
          firstName,
          lastName,
          gender,
          educationLevel,
          expertise,
          dateOfBirth,
          workPlace,
          profileImage: "/icons/cms.svg",
          idNumber,
          branch,
        },
        id: memberId,
      });
    } else if (membershipType === MembershipType.Company) {
      result = await updateInstitutionMember({
        memberData: {
          ...sharedMember,
          institutionName,
          headOrRepresentative,
          fieldOfWork,
          partnershipIdea,
        },
        id: memberId,
      });
    }

    if (result) {
      return NextResponse.json(
        { success: true, value: result },
        { status: 200 }
      );
    }
    return NextResponse.json(
      { success: false, error: "Unable to update member" },
      { status: 500 }
    );
  } catch (err) {
    console.warn(err);
    return NextResponse.json(
      {
        success: false,
        error: "Unable to update member",
      },
      { status: 500 }
    );
  }
}
