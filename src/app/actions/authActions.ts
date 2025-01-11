"use server";

import { authOptions } from "@/lib/authOptions";
import { sendPasswordResetEmail, sendVerificationEmail } from "@/lib/mail";
import prisma from "@/lib/PrismaClient";
import { loginSchemaTypes } from "@/lib/schemas/LoginSchema";
import {
  combinedRegisterSchema,
  ProfileSchemaType,
  registerSchemaType,
} from "@/lib/schemas/RegisterSchema";
import { generateToken, getTokenByToken } from "@/lib/tokens";
import { ActionResult } from "@/types";
import { TokenType, User } from "@prisma/client";

import bcrypt from "bcrypt";
import { getServerSession } from "next-auth";

// Server Action to Register user.
export const RegisterUser = async (
  data: registerSchemaType
): Promise<ActionResult<User>> => {
  try {
    const validated = combinedRegisterSchema.safeParse(data);

    if (!validated.success) {
      // here if we use "throw new error", it will send very complicated errors on the client side.
      // So to send cleaner errors on the client side, we have defined return types in "index.d.ts" file. which we are using here.
      return { status: "error", error: validated.error.errors };
    }
    const {
      name,
      email,
      password,
      gender,
      country,
      city,
      dateOfBirth,
      description,
    } = validated.data;

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
        profileComplete: true,
        member: {
          create: {
            name,
            description,
            city,
            country,
            dateOfBirth: new Date(dateOfBirth),
            gender,
          },
        },
      },
    });

    const verificationToken = await generateToken(
      email,
      TokenType.VERIFICATION
    );

    await sendVerificationEmail(
      verificationToken.email,
      verificationToken.token
    );

    return { status: "success", data: user };
  } catch (error) {
    console.log(error);
    return { status: "error", error: "Something went Wrong" };
  }
};

export async function SignInUser(data: loginSchemaTypes) {
  try {
    const existingUser = await getUserByEmail(data.email);

    if (!existingUser || !existingUser.email)
      return { status: "error", error: "Invalid credentials" };

    if (!existingUser.emailVerified) {
      const token = await generateToken(
        existingUser.email,
        TokenType.VERIFICATION
      );

      await sendVerificationEmail(token.email, token.token);

      return { status: "error", error: "Please verify your email address" };
    }
  } catch (error) {
    console.log(error);
    return { status: "error", error: "Something went wrong" };
  }
}

export async function getCurrentUserId() {
  const session = await getServerSession(authOptions);

  const userId = session?.user?.id;

  if (!userId) throw new Error("Unauthorised");

  return userId;
}

export async function getUserByEmail(email: string) {
  return prisma.user.findUnique({ where: { email } });
}

export async function verifyEmail(
  token: string
): Promise<ActionResult<string>> {
  try {
    const existingToken = await getTokenByToken(token);

    if (!existingToken) {
      return { status: "error", error: "Invalid Token" };
    }

    const hasExpired = new Date() > existingToken.expires;

    if (hasExpired) {
      return { status: "error", error: "Token has expired" };
    }

    const existingUser = await getUserByEmail(existingToken.email);

    if (!existingUser) {
      return { status: "error", error: "user not found" };
    }

    await prisma.user.update({
      where: {
        id: existingUser.id,
      },
      data: {
        emailVerified: new Date(),
      },
    });

    await prisma.token.delete({ where: { id: existingToken.id } });

    return { status: "success", data: "Success" };
  } catch (error) {
    console.log(error);
    throw error;
  }
}

export async function generateResetPasswordEmail(
  email: string
): Promise<ActionResult<string>> {
  try {
    const existingUser = await getUserByEmail(email);

    if (!existingUser) {
      return { status: "error", error: "User does not exist" };
    }

    const token = await generateToken(email, TokenType.PASSWORD_RESET);

    await sendPasswordResetEmail(token.email, token.token);

    return {
      status: "success",
      data: "Password reset email has been sent. Please check your email",
    };
  } catch (error) {
    console.log(error);
    return { status: "error", error: "Something went wrong" };
  }
}

export async function resetPassword(
  password: string,
  token: string | null
): Promise<ActionResult<string>> {
  try {
    if (!token) return { status: "error", error: "Missing Token" };

    const existingToken = await getTokenByToken(token);

    if (!existingToken) {
      return { status: "error", error: "Invalid Token" };
    }

    const hasExpired = new Date() > existingToken.expires;

    if (hasExpired) {
      return { status: "error", error: "Token has expired" };
    }

    const existingUser = await getUserByEmail(existingToken.email);

    if (!existingUser) {
      return { status: "error", error: "user not found" };
    }

    const HashedPassword = await bcrypt.hash(password, 10);

    await prisma.user.update({
      where: { id: existingUser.id },
      data: {
        password: HashedPassword,
      },
    });

    await prisma.token.delete({ where: { id: existingToken.id } });

    return {
      status: "success",
      data: "Password updated Successfully. Please try logging In",
    };
  } catch (error) {
    console.log(error);
    return { status: "error", error: "Something went wrong" };
  }
}

export async function completeSocialLoginProfile(
  data: ProfileSchemaType
): Promise<ActionResult<string>> {
  const session = await getServerSession(authOptions);

  if (!session?.user) return { status: "error", error: "User not found" };

  try {
    const user = await prisma.user.update({
      where: {
        id: session.user.id,
      },

      data: {
        profileComplete: true,
        member: {
          create: {
            name: session.user.name as string,
            image: session.user.image as string,
            gender: data.gender,
            dateOfBirth: new Date(data.dateOfBirth),
            description: data.description,
            city: data.city,
            country: data.country,
          },
        },
      },
      select: {
        accounts: {
          select: {
            provider: true,
          },
        },
      },
    });

    return { status: "success", data: user.accounts[0].provider };
  } catch (error) {
    console.log(error);
    throw error;
  }
}

export async function getUserRole() {
  const session = await getServerSession(authOptions);

  const role = session?.user.role;

  if (!role) throw new Error("Not in role ");

  return role;
}
