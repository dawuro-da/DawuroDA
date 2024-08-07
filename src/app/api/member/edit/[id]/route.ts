import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import {
  ContributionSystem,
  EducationLevel,
  Gender,
  MembershipLevel,
  MembershipType,
  PaymentMeans,
  UserRole,
} from "@prisma/client";
import {
  findMemberByEmail,
  findMemberByPhone,
  updateIndividualMember,
  updateInstitutionMember,
} from "@/db/member";
import { OPTIONS } from "@/util/authOptions";
import { uploadFile } from "@/util/uploadFile";

export async function POST(req: Request, context: { params: { id: string } }) {
  const session = await getServerSession(OPTIONS);
  if (!session?.user?.id) {
    return NextResponse.redirect("/gaadmin/login", 401);
  } else if (
    session?.user.role === UserRole.Member &&
    session.user.id !== context.params.id
  ) {
    return NextResponse.json(
      {
        success: false,
        error: "Unauthorized member",
      },
      { status: 401 }
    );
  }

  const formData = await req.formData();

  const email = formData.get("email") as string;
  const phone = formData.get("phone") as string;
  const membershipLevel = formData.get("membershipLevel") as MembershipLevel;
  const contributionAmount = formData.get("contributionAmount") as string;
  const contributionSystem = formData.get(
    "contributionSystem"
  ) as ContributionSystem;
  const hasPaid = formData.get("hasPaid") === "true" ? true : false;
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
  const branch = formData.get("branch") as string;

  const memberId = context.params.id;

  const emailExist = Boolean(email) && (await findMemberByEmail(email));
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
    let imageUrl;
    if (profileImage.name) {
      imageUrl =
        (await uploadFile({
          path: "/profileImages",
          fileName: profileImage.name,
          file: profileImage,
          mimeType: profileImage.type,
        })) ?? imageUrl;
    }

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
          profileImage: profileImage.name
            ? imageUrl ?? "/icons/list.svg"
            : (profileImage as unknown as string),
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
