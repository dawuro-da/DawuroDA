import { Gender, Prisma, User, UserRole } from "@prisma/client";
import prisma from "@/lib/prisma";

export async function findUserByEmail(email: string): Promise<User | null> {
  try {
    return await prisma.user.findUnique({
      where: {
        email: email,
      },
    });
  } catch (err) {
    console.error(err);
    return null;
  }
}

export async function findByPhone(phone: string): Promise<User | null> {
  try {
    return await prisma.user.findUnique({
      where: {
        phone: phone,
      },
    });
  } catch (err) {
    console.error(err);
    return null;
  }
}
export async function findUserByToken(token: string): Promise<User | null> {
  try {
    return await prisma.user.findFirst({
      where: {
        token: token,
      },
    });
  } catch (err) {
    console.error(err);
    return null;
  }
}
export async function findUserById(id: string): Promise<User | null> {
  try {
    return await prisma.user.findUnique({
      where: {
        id: id,
      },
    });
  } catch (err) {
    console.error(err);
    return null;
  }
}

export async function createUser({
  firstName,
  lastName,
  role,
  gender,
  email,
  phone,
  password,
  password_salt,
}: {
  firstName: string;
  lastName: string;
  role: UserRole;
  gender?: Gender;
  email: string;
  phone?: string;
  password: string;
  password_salt: string;
}) {
  try {
    const user = await prisma.user.create({
      data: {
        firstName,
        lastName,
        role,
        gender,
        email,
        password_hash: password,
        password_salt,
        phone,
      },
    });
    return user;
  } catch (error) {
    console.error({ error });
    if (error instanceof Prisma.PrismaClientKnownRequestError) {
      throw error;
    }
  }
}

export async function updateUser({
  firstName,
  lastName,
  gender,
  email,
  phone,
  userId,
  profilePic,
}: {
  userId: string;
  firstName?: string;
  lastName?: string;
  gender?: Gender;
  email?: string;
  phone?: string;
  profilePic?: string;
}) {
  try {
    const user = await prisma.user.update({
      where: { id: userId },
      data: {
        firstName,
        lastName,
        gender,
        email,
        phone,
        profilePic,
      },
    });

    return user;
  } catch (error) {
    console.error(error);
    if (error instanceof Prisma.PrismaClientKnownRequestError) {
      throw error;
    }
  }
}

export async function updateUserToken({
  token,
  userId,
}: {
  userId: string;
  token: string;
}) {
  try {
    const user = await prisma.user.update({
      where: { id: userId },
      data: {
        token,
      },
    });

    return user;
  } catch (error) {
    console.error(error);
    if (error instanceof Prisma.PrismaClientKnownRequestError) {
      throw error;
    }
  }
}

export async function fetchUsers({
  page,
  pageSize,
}: {
  page: number;
  pageSize: number;
}): Promise<User[] | undefined> {
  return await prisma.user.findMany({
    where: {},
    orderBy: {
      created_at: "desc",
    },
    skip: (page - 1) * pageSize,
    take: pageSize,
  });
}

/**
 *
 * @param searchText @param page @param pageSize are the props recieved and then
 * searchs in the db if some field contained the search text
 * @returns
 *     - data => user found in this @param page
 *     - total count => to make the pagination of searched data
 */
export async function searchUsers({
  searchText,
  page,
  pageSize,
}: {
  searchText: string;
  page: number;
  pageSize: number;
}): Promise<{ users: User[]; usersCount: number } | undefined> {
  const whereClause: Prisma.UserWhereInput = {
    OR: [
      {
        firstName: {
          contains: searchText,
          mode: "insensitive",
        },
      },
      {
        lastName: {
          contains: searchText,
          mode: "insensitive",
        },
      },
      {
        email: {
          contains: searchText,
          mode: "insensitive",
        },
      },
      {
        phone: {
          contains: searchText,
          mode: "insensitive",
        },
      },
    ],
  };

  const users = await prisma.user.findMany({
    where: whereClause,
    orderBy: {
      created_at: "desc",
    },
    skip: (page - 1) * pageSize,
    take: pageSize,
  });
  const usersCount = await prisma.user.count({
    where: whereClause,
  });

  return { users, usersCount };
}

export async function updateUserPassword({
  email,
  passwordSalt,
  newPassword,
}: {
  email: string;
  passwordSalt: string;
  newPassword: string;
}): Promise<User | undefined> {
  return await prisma.user.update({
    where: {
      email: email,
    },
    data: {
      password_salt: passwordSalt,
      password_hash: newPassword,
    },
  });
}

export async function deleteUser({
  id,
}: {
  id: string;
}): Promise<User | undefined> {
  return await prisma.user.delete({
    where: {
      id: id,
    },
  });
}
