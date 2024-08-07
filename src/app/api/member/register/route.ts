import { NextResponse } from "next/server";
import bcrypt from "bcrypt";
import { getServerSession } from "next-auth";
import { OPTIONS } from "@/util/authOptions";
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
  createIndividualMember,
  createInstitutionMember,
  findMemberByEmail,
  findMemberByPhone,
} from "@/db/member";
import { calculateNextDueDate } from "@/util/date";
import { generateMemberId } from "@/util/helper";
import { createContribution } from "@/db/contribution";
import { uploadFile } from "@/util/uploadFile";

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

export async function POST(req: Request) {
  const session = await getServerSession(OPTIONS);
  if (!session?.user?.id || session?.user.role === UserRole.Member) {
    return NextResponse.redirect("/gaadmin/login", 401);
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

  const emailExist = Boolean(await findMemberByEmail(email));
  const phoneExist = Boolean(await findMemberByPhone(phone));

  if (emailExist) {
    return NextResponse.json(
      {
        success: false,
        error: "Email already exist",
      },
      { status: 409 }
    );
  } else if (phoneExist) {
    return NextResponse.json(
      {
        success: false,
        error: "Phone already exist",
      },
      { status: 409 }
    );
  } else {
    const saltRounds = 10;
    const salt = await bcrypt.genSalt(saltRounds);
    const hashedPassword = await hashPassword("dummyPassword", salt);

    if (!hashedPassword)
      return NextResponse.json(
        {
          success: false,
          error: "Unable to create member ( password issue)",
        },
        { status: 500 }
      );

    try {
      const memberId = generateMemberId();
      const date = new Date(Date.now());

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
        memberId,
        registeredBy: session.user?.id,
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

      let imageUrl = "/icons/cms.svg";
      if (profileImage) {
        imageUrl =
          (await uploadFile({
            path: "/profileImages",
            fileName: profileImage.name ?? "name",
            file: profileImage,
            mimeType: profileImage.type,
          })) ?? imageUrl;
      }

      let result;
      if (membershipType === MembershipType.Individual) {
        result = await createIndividualMember({
          individualData: {
            ...sharedMember,
            firstName,
            lastName,
            gender,
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
            institutionName,
            headOrRepresentative,
            fieldOfWork,
            partnershipIdea,
          },
        });
      }

      if (result) {
        await createContribution({
          contributionSystem: result.contributionSystem,
          contributorId: result.id,
          amount: contributionAmount,
        });
        return NextResponse.json(
          { success: true, value: result },
          { status: 200 }
        );
      }
      return NextResponse.json(
        { success: false, error: "Unable to create member" },
        { status: 500 }
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
}
