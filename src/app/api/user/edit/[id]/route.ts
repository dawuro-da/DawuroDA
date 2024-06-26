import { NextResponse } from "next/server";
import { findUserByEmail, findByPhone, updateUser } from "@/db/user";
import { getServerSession } from "next-auth";
import { OPTIONS } from "@/util/authOptions";
import { Gender, UserRole } from "@prisma/client";
import { uploadFile } from "@/util/uploadFile";

export async function POST(req: Request, context: { params: { id: string } }) {
  const session = await getServerSession(OPTIONS);
  if (!session?.user?.id || session?.user.role === UserRole.Member) {
    return NextResponse.redirect("/gaadmin/login", 401)
  }
  try {
    const userId = context.params.id;
    const formData = await req.formData();
    const firstName = formData.get("firstName") as string;
    const lastName = formData.get("lastName") as string;
    const gender = formData.get("gender") as Gender;
    const email = formData.get("email") as string;
    const phone = formData.get("phone") as string;
    const profilePic = formData.get("profilePic") as File;

    const emailExist = await findUserByEmail(email);
    const phoneExist = await findByPhone(phone);

    if (emailExist) {
      if (emailExist.id !== userId) {
        return NextResponse.json(
          {
            success: false,
            error: "Email already exist",
          },
          { status: 409 }
        );
      }
    }
    if (phoneExist) {
      if (phoneExist.id !== userId) {
        return NextResponse.json(
          {
            success: false,
            error: "Phone already exist",
          },
          { status: 409 }
        );
      }
    }

    const imageUrl = profilePic.name
      ? await uploadFile({
          path: "/adminProfilePic",
          fileName: profilePic.name ?? "name",
          file: profilePic,
          mimeType: profilePic.type,
        })
      : (profilePic as unknown as string);

    const result = await updateUser({
      firstName,
      lastName,
      gender,
      phone,
      email,
      userId,
      profilePic: imageUrl,
    });

    if (result) {
      return NextResponse.json(
        { success: true, value: result },
        { status: 200 }
      );
    }
    return NextResponse.json(
      {
        success: false,
        error: "Unable to update user",
      },
      { status: 500 }
    );
  } catch (err) {
    console.warn(err);
    return NextResponse.json(
      {
        success: false,
        error: "Unable to update user",
      },
      { status: 500 }
    );
  }
}
