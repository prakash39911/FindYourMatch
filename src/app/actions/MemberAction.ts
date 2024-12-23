"use server";

import { authOptions } from "@/lib/authOptions";
import prisma from "@/lib/PrismaClient";
import { getServerSession } from "next-auth";

export async function GetMembers() {
  const session = await getServerSession(authOptions);
  if (!session.user) {
    return;
  }

  try {
    return await prisma.member.findMany({
      where: {
        NOT: {
          userId: session?.user.id,
        },
      },
    });
  } catch (error) {
    console.log(error);
  }
}

export async function getMemberByUserId(userId: string) {
  try {
    return await prisma.member.findUnique({
      where: {
        userId,
      },
    });
  } catch (error) {
    console.log(error);
  }
}

export async function getMemberPhotosByUserId(userId: string) {
  const member = await prisma.member.findUnique({
    where: { userId },
    select: { photos: true },
  });

  if (!member) return null;

  return member.photos.map((p) => p);
}
