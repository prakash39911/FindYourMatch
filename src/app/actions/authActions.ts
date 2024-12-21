"use server";

import { authOptions } from "@/lib/authOptions";
import prisma from "@/lib/PrismaClient";
import {
  registerSchema,
  registerSchemaType,
} from "@/lib/schemas/RegisterSchema";
import { ActionResult } from "@/types";
import { User } from "@prisma/client";

import bcrypt from "bcrypt";
import { getServerSession } from "next-auth";

// Server Action to Register user.
export const RegisterUser = async (
  data: registerSchemaType
): Promise<ActionResult<User>> => {
  try {
    const validated = registerSchema.safeParse(data);

    if (!validated.success) {
      // here if we use "throw new error", it will send very complicated errors on the client side.
      // So to send cleaner errors on the client side, we have defined return types in "index.d.ts" file. which we are using here.
      return { status: "error", error: validated.error.errors };
    }
    const { name, email, password } = validated.data;

    const hashedPassword = await bcrypt.hash(password, 10);

    const existingUser = await prisma.user.findUnique({ where: { email } });

    if (existingUser) {
      return { status: "error", error: "User already exist" };
    }

    const user = await prisma.user.create({
      data: {
        name,
        email,
        password: hashedPassword,
      },
    });

    return { status: "success", data: user };
  } catch (error) {
    console.log(error);
    return { status: "error", error: "Something went Wrong" };
  }
};

export async function getCurrentUserId() {
  const session = await getServerSession(authOptions);
  const userId = session?.user?.id;

  if (!userId) throw new Error("Unauthorised");

  return userId;
}
