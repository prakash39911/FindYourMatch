"use server";

import {
  memberEditSchema,
  MemberEditSchemaType,
} from "@/lib/schemas/memberEditSchema";
import { ActionResult } from "@/types";
import { Member, Photo } from "@prisma/client";
import { getCurrentUserId } from "./authActions";
import prisma from "@/lib/PrismaClient";
import { cloudinary } from "@/lib/cloudinary";

export async function updateMemberProfile(
  data: MemberEditSchemaType,
  nameUpdated: boolean
): Promise<ActionResult<Member>> {
  try {
    const userId = await getCurrentUserId();

    const validated = memberEditSchema.safeParse(data); // Vilidating the data on the server,  Coming from client.

    if (!validated.success)
      return { status: "error", error: validated.error.errors };

    const { name, description, city, country } = validated.data;

    if (nameUpdated) {
      await prisma.user.update({
        where: {
          id: userId,
        },
        data: {
          name,
        },
      });
    }

    const member = await prisma.member.update({
      where: {
        userId,
      },
      data: {
        name,
        description,
        city,
        country,
      },
    });

    return { status: "success", data: member };
  } catch (error) {
    console.log(error);
    return { status: "error", error: "Something went Wrong" };
  }
}

export async function addImage(url: string, publicId: string) {
  try {
    const userId = await getCurrentUserId();

    return prisma.member.update({
      where: {
        userId,
      },
      data: {
        photos: {
          create: [{ url, publicId }],
        },
      },
    });
  } catch (error) {
    console.log(error);
    throw error;
  }
}

export async function setMainImage(photo: Photo) {
  try {
    const userId = await getCurrentUserId();

    await prisma.user.update({
      where: { id: userId },
      data: {
        image: photo.url,
      },
    });

    return prisma.member.update({
      where: { userId },
      data: {
        image: photo.url,
      },
    });
  } catch (error) {
    console.log(error);
    throw error;
  }
}

export async function getuserInfoForNav() {
  try {
    const userId = await getCurrentUserId();
    return prisma.user.findUnique({
      where: {
        id: userId,
      },
      select: {
        name: true,
        image: true,
      },
    });
  } catch (error) {
    console.log(error);
    throw error;
  }
}

export async function deleteImage(photo: Photo) {
  try {
    const userId = await getCurrentUserId();

    if (photo.publicId) {
      await cloudinary.v2.uploader.destroy(photo.publicId);
    }

    return prisma.member.update({
      where: {
        id: userId,
      },
      data: {
        photos: {
          delete: {
            id: photo.id,
          },
        },
      },
    });
  } catch (error) {
    console.log(error);
    throw error;
  }
}
