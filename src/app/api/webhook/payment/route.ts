import { NextResponse } from "next/server";
import { findTempMemberByEmailAndPhone } from "@/db/tempMember";
import { generateMemberId } from "@/util/helper";
import { calculateNextDueDate } from "@/util/date";
import prisma from "@/lib/prisma";

export async function POST(req: Request, res: any) {
  // chapa
  // {
  //   event: 'charge.success',
  //   first_name: 'Bilen',
  //   last_name: 'Gizachew',
  //   email: 'abebech_bekele@gmail.com',
  //   mobile: null,
  //   currency: 'ETB',
  //   amount: '100.00',
  //   charge: '3.50',
  //   status: 'success',
  //   mode: 'test',
  //   reference: 'APOIkm9PlGaiO',
  //   created_at: '2024-05-08T21:41:36.000000Z',
  //   updated_at: '2024-05-08T21:41:36.000000Z',
  //   type: 'API',
  //   tx_ref: 'chewatatest-0.4589925656490659',
  //   payment_method: 'test',
  //   customization: { title: null, description: null, logo: null },
  //   meta: 'null'
  // }
  try {
    const { event, email, mobile } = await req.json();
    if (event === "charge.success") {
      const tempMember = await findTempMemberByEmailAndPhone({
        email,
        phone: mobile,
      });
      if (tempMember) {
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

        await prisma.member.create({
          data: {
            ...sharedData,
            memberId: generateMemberId(),
            firstName: tempMember.firstName,
            lastName: tempMember.lastName,
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
      }
    }
    return NextResponse.json(
      {
        success: "OK",
      },
      { status: 200 }
    );
  } catch (error) {
    return NextResponse.json(
      {
        success: "Can't process payment",
      },
      { status: 500 }
    );
  }
}
