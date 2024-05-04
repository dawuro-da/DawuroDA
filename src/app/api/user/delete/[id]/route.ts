import { NextResponse } from "next/server";
import bcrypt from "bcrypt";
import {
  createUser,
  deleteUser,
  findByEmail,
  findByPhone,
  findUserById,
  updateUser,
} from "@/db/user";
import { getServerSession } from "next-auth";
import { OPTIONS } from "@/app/api/auth/[...nextauth]/route";

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

export async function Put(req: Request, context: { id: string }) {
  const session = await getServerSession(OPTIONS);
  if (!session?.user.id) {
    return NextResponse.json(
      { success: false, error: "Unauthorized user" },
      { status: 401 }
    );
  }

  const userId = context.id;

  const user = await findUserById(userId);

  if (!user) {
    return NextResponse.json(
      {
        success: false,
        error: "User doesn't exist",
      },
      { status: 409 }
    );
  } else {
    try {
      const result = await deleteUser({ id: userId });

      if (result) {
        return NextResponse.json(
          { success: true, value: "ok" },
          { status: 200 }
        );
      }
    } catch (err) {
      console.warn(err);
      return NextResponse.json(
        {
          success: false,
          error: "Unable to delete user",
        },
        { status: 500 }
      );
    }
  }
}
