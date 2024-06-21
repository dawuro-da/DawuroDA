import { NextResponse } from "next/server";
import bcrypt from "bcrypt";
import { createUser, findUserByEmail, findByPhone } from "@/db/user";
import { getServerSession } from "next-auth";
import { OPTIONS } from "@/util/authOptions";

export async function hashPassword(
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
  const { firstName, lastName, role, gender, email, phone, password } =
    await req.json();

  const session = await getServerSession(OPTIONS);
  if (!session?.user?.id) {
    return NextResponse.json(
      { success: false, error: "Unauthorized user" },
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
        password: hashedPassword,
        email,
        password_salt: salt,
      };
      const result = await createUser(userData);

      if (result) {
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
