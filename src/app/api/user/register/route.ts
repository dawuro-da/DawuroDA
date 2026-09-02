import { NextResponse } from "next/server";
import bcrypt from "bcrypt";
import { createUser, findUserByEmail, findByPhone } from "@/db/user";
import { getServerSession } from "next-auth";
import { OPTIONS } from "@/util/authOptions";
import { hashPassword } from "@/util/hash";
import { RegisteredAsAdmin } from "@/util/emailTemplate";
import { transporter } from "@/services/nodemailer";
import { createAuditLog } from "@/db/auditLog";

export async function POST(req: Request) {
  const { firstName, lastName, role, gender, email, phone, branch, password } =
    await req.json();

  const session = await getServerSession(OPTIONS);
  if (!session?.user?.id) {
    return NextResponse.json(
      { success: false, error: "Unauthorized" },
      { status: 401 }
    );
  }

  const emailExist = Boolean(await findUserByEmail(email));
  const phoneExist = Boolean(await findByPhone(phone));

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
    const hashedPassword = await hashPassword(
      password ? password : "dummypassword",
      salt
    );

    if (!hashedPassword)
      return NextResponse.json(
        {
          success: false,
          error: "Unable to create user ( password issue)",
        },
        { status: 500 }
      );
    try {
      const userData = {
        firstName,
        lastName,
        role,
        gender,
        phone,
        branch,
        password: hashedPassword,
        email,
        password_salt: salt,
      };

      const result = await createUser(userData);

      const html = RegisteredAsAdmin({
        name: `${firstName} ${lastName}`,
        email: email,
        password: password ? password : "dummypassword",
        role: role,
      });

      const emailRes = await transporter.sendMail({
        to: email,
        from: process.env.NODEMAIL_EMAIL,
        subject: "DawuroDA admin registration",
        text: html,
        html: html,
      });

      if (result) {
        await createAuditLog({
          entityType: "AdminUser",
          entityId: result.id,
          entityLabel: `${firstName ?? ""} ${lastName ?? ""}`.trim() || email,
          action: "CREATE",
          changes: { role: { from: null, to: role } },
          performedById: session.user.id,
          performedByName:
            `${session.user.firstName ?? ""} ${
              session.user.lastName ?? ""
            }`.trim() || undefined,
          performedByRole: session.user.role,
        });
        return NextResponse.json(
          { success: true, value: result },
          { status: 200 }
        );
      }
    } catch (err) {
      console.warn(err);
      return NextResponse.json(
        {
          success: false,
          error: "Unable to create user",
        },
        { status: 500 }
      );
    }
  }
}
