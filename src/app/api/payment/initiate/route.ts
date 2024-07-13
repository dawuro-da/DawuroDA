import { NextResponse } from "next/server";
import bcrypt from "bcrypt";
import { getServerSession } from "next-auth";
import { OPTIONS } from "@/util/authOptions";
import {
  ContributionSystem,
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
  const {
    contributionAmount,
    email,
    firstName,
    lastName,
    phone,
    institutionName,
  } = await req.json();

  try {
    var raw = JSON.stringify({
      amount: contributionAmount,
      currency: "ETB",
      email: email,
      first_name: `${firstName ? firstName : institutionName}`,
      last_name: `${lastName ? lastName : ""}`,
      phone_number: `${phone}`,
      tx_ref: `chewatatest-${Math.random()}`,
      callback_url: `${process.env.PAYMENT_WEB_HOOK}/api/webhook/payment`,
    //   return_url: `${process.env.PAYMENT_WEB_HOOK}/login`,
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
