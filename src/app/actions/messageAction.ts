"use server";

import { messageSchema, messageSchemaType } from "@/lib/schemas/messageSchema";
import { ActionResult, MessageDTO } from "@/types";
import { getCurrentUserId } from "./authActions";
import prisma from "@/lib/PrismaClient";
import { mapMessageToMessageDTO } from "@/lib/mapping";
import { pusherServer } from "@/lib/pusher";
import { createChatId } from "@/lib/utils";

const messageSelect = {
  id: true,
  text: true,
  created: true,
  dateRead: true,
  sender: {
    select: {
      userId: true,
      name: true,
      image: true,
    },
  },
  recipient: {
    select: {
      userId: true,
      name: true,
      image: true,
    },
  },
};

export async function createMessage(
  recipientUserId: string,
  data: messageSchemaType
): Promise<ActionResult<MessageDTO>> {
  try {
    const userId = await getCurrentUserId();
    const validated = messageSchema.safeParse(data);

    if (!validated.success)
      return { status: "error", error: validated.error.errors };

    const { text } = validated.data;

    const message = await prisma.message.create({
      data: {
        text: text,
        recipientId: recipientUserId,
        senderId: userId,
      },
      select: messageSelect,
    });

    const messageDto = mapMessageToMessageDTO(message);

    await pusherServer.trigger(
      createChatId(userId, recipientUserId),
      "message:new",
      messageDto
    );

    await pusherServer.trigger(
      `private-${recipientUserId}`,
      "message:new",
      messageDto
    );

    return { status: "success", data: messageDto };
  } catch (error) {
    console.log(error);
    return { status: "error", error: "Something Went Wrong" };
  }
}

export async function getMessageThread(recipientId: string) {
  try {
    const userId = await getCurrentUserId();

    const messages = await prisma.message.findMany({
      where: {
        OR: [
          {
            senderId: userId,
            recipientId,
            senderDeleted: false,
          },
          {
            senderId: recipientId,
            recipientId: userId,
            recipientDeleted: false,
          },
        ],
      },
      orderBy: {
        created: "asc",
      },
      select: messageSelect,
    });

    let readCount = 0;

    if (messages.length > 0) {
      const readMessageIds = messages
        .filter(
          (m) =>
            m.dateRead === null &&
            m.recipient?.userId === userId &&
            m.sender?.userId === recipientId
        )
        .map((m) => m.id);

      await prisma.message.updateMany({
        where: { id: { in: readMessageIds } },
        data: { dateRead: new Date() },
      });

      readCount = readMessageIds.length;

      await pusherServer.trigger(
        createChatId(recipientId, userId),
        "messages:read",
        readMessageIds
      );
    }
    const messagesToReturn = messages.map((message) =>
      mapMessageToMessageDTO(message)
    );

    return { messages: messagesToReturn, readCount };
  } catch (error) {
    console.log(error);
    throw error;
  }
}

export async function getMessagesByContainer(container: string) {
  try {
    const userId = await getCurrentUserId();

    const conditions = {
      [container === "outbox" ? "senderId" : "recipientId"]: userId,
      ...(container === "outbox"
        ? { senderDeleted: false }
        : { recipientDeleted: false }),
    };

    const messages = await prisma.message.findMany({
      where: conditions,
      orderBy: {
        created: "desc",
      },
      select: messageSelect,
    });

    return messages.map((message) => mapMessageToMessageDTO(message));
  } catch (error) {
    console.log(error);
    throw error;
  }
}

export async function deleteMessage(messageId: string, isOutbox: boolean) {
  const selector = isOutbox ? "senderDeleted" : "recipientDeleted";

  try {
    const userId = await getCurrentUserId();

    await prisma.message.update({
      where: {
        id: messageId,
      },
      data: {
        [selector]: true,
      },
    });

    const messagesToDelete = await prisma.message.findMany({
      where: {
        OR: [
          {
            senderId: userId,
            senderDeleted: true,
            recipientDeleted: true,
          },
          {
            recipientId: userId,
            senderDeleted: true,
            recipientDeleted: true,
          },
        ],
      },
    });

    if (messagesToDelete.length > 0) {
      await prisma.message.deleteMany({
        where: {
          OR: messagesToDelete.map((m) => ({ id: m.id })),
        },
      });
    }
  } catch (error) {
    console.log(error);
    throw error;
  }
}

export async function getUnreadMessageCount() {
  try {
    const userId = await getCurrentUserId();

    return prisma.message.count({
      where: {
        recipientId: userId,
        dateRead: null,
        recipientDeleted: false,
      },
    });
  } catch (error) {
    console.log(error);
    throw error;
  }
}
