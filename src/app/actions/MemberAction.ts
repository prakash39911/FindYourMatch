"use server";

import prisma from "@/lib/PrismaClient";
import { GetMemberParams, PaginatedResponse } from "@/types";
import { addYears } from "date-fns";
import { getCurrentUserId } from "./authActions";
import { Member, Photo } from "@prisma/client";

export async function GetMembers({
  ageRange = "18,100",
  gender = "male,female",
  orderBy = "updated",
  pageNumber = "1",
  pageSize = "12",
  withPhoto = "true",
}: GetMemberParams): Promise<PaginatedResponse<Member>> {
  const userId = await getCurrentUserId();

  const [minAge, maxAge] = ageRange.split(",");
  const currentDate = new Date();
  const minDob = addYears(currentDate, -maxAge - 1);
  const maxDob = addYears(currentDate, -minAge);

  const selectedGender = gender.split(",");

  const page = parseInt(pageNumber);
  const limit = parseInt(pageSize);

  const skip = (page - 1) * limit;

  try {
    const count = await prisma.member.count({
      where: {
        AND: [
          { dateOfBirth: { gte: minDob } },
          { dateOfBirth: { lte: maxDob } },
          { gender: { in: selectedGender } },
          ...(withPhoto === "true" ? [{ image: { not: null } }] : []),
        ],
        NOT: {
          userId,
        },
      },
    });

    const members = await prisma.member.findMany({
      where: {
        AND: [
          { dateOfBirth: { gte: minDob } },
          { dateOfBirth: { lte: maxDob } },
          { gender: { in: selectedGender } },
          ...(withPhoto === "true" ? [{ image: { not: null } }] : []),
        ],
        NOT: {
          userId,
        },
      },
      orderBy: {
        [orderBy]: "desc",
      },
      skip,
      take: limit,
    });

    return {
      items: members,
      totalCount: count,
    };
  } catch (error) {
    console.log(error);
    throw error;
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
  const currentUserId = await getCurrentUserId();

  const member = await prisma.member.findUnique({
    where: { userId },
    select: {
      photos: {
        where: currentUserId === userId ? {} : { isApproved: true },
      },
    },
  });

  if (!member) return null;

  return member.photos as Photo[];
}

export async function updateLastActive() {
  const userId = await getCurrentUserId();

  try {
    return prisma.member.update({
      where: { userId },
      data: {
        updated: new Date(),
      },
    });
  } catch (error) {
    console.log(error);
    throw error;
  }
}
