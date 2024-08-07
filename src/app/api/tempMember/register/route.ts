import { NextResponse } from "next/server";
import bcrypt from "bcrypt";
import {
  ContributionSystem,
  EducationLevel,
  Gender,
  MembershipLevel,
  MembershipType,
  PaymentMeans,
} from "@prisma/client";
import { calculateNextDueDate } from "@/util/date";
import { uploadFile } from "@/util/uploadFile";
import {
  createIndividualTempMember,
  createInstitutionTempMember,
} from "@/db/tempMember";
import axios from "axios";

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
  const formData = await req.formData();

  const email = formData.get("email") as string;
  const phone = formData.get("phone") as string;
  const membershipLevel = formData.get("membershipLevel") as MembershipLevel;
  const contributionAmount = formData.get("contributionAmount") as string;
  const contributionSystem = formData.get(
    "contributionSystem"
  ) as ContributionSystem;
  const hasPaid = formData.get("hasPaid") === "true" ? false : false;
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

  try {
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

    let imageUrl = "/icons/avatar.svg";
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
      result = await createIndividualTempMember({
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
      result = await createInstitutionTempMember({
        institutionData: {
          ...sharedMember,
          institutionName,
          headOrRepresentative,
          fieldOfWork,
          partnershipIdea,
        },
      });
    }

    var raw = JSON.stringify({
      amount: contributionAmount,
      currency: "ETB",
      email: email,
      first_name: `${firstName}`,
      last_name: `${lastName}`,
      phone_number: `${phone}`,
      tx_ref: `gammo-reg-${Math.random()}`,
      callback_url: `${process.env.PAYMENT_WEB_HOOK}/api/webhook/payment`,
      return_url: `${process.env.PAYMENT_WEB_HOOK}/login`,
      "customization[title]": "Gammoda member's contribution",
      "customization[description]":
        "this membership contribution should be paid after compeletion of your registration ",
    });
    const res = await axios.post(
      "https://api.chapa.co/v1/transaction/initialize",
      raw,
      {
        headers: {
          Authorization: `Bearer ${process.env.CHAPA_SECRET_KEY}`,
          "Content-Type": "application/json",
        },
      }
    );
    if (res) {
      return NextResponse.json(
        { success: true, value: res.data },
        { status: 200 }
      );
    }
    return NextResponse.json(
      { success: false, error: "Unable to create member" },
      { status: 500 }
    );
  } catch (err: any) {
    console.warn(err.response.data);
    return NextResponse.json(
      {
        success: false,
        error: "Unable to create member",
      },
      { status: 500 }
    );
  }
}
