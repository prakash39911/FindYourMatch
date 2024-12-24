// The types we are defining here, we can use them in all of our projects.
// As we can not do "throw new error" on server components to Show error on the client side.
// We have defined types here so that we can use these type on the Server Action to tell about errors on the client side.
// This will give us the structure for error handling on our server Actions.
import { Prisma } from "@prisma/client";
import { ZodIssue } from "zod";

type ActionResult<T> =
  | { status: "success"; data: T }
  | { status: "error"; error: string | ZodIssue[] };

type MessageWithSenderRecipient = Prisma.MessageGetPayload<{
  select: {
    id: true;
    text: true;
    created: true;
    dateRead: true;
    sender: {
      select: {
        userId;
        name;
        image;
      };
    };
    recipient: {
      select: {
        userId;
        name;
        image;
      };
    };
  };
}>;

type MessageDTO = {
  id: string;
  text: string;
  created: string;
  dateRead: string | null;
  senderId?: string;
  senderName?: string;
  senderImage?: string | null;
  recipientId?: string;
  recipientName?: string;
  recipientImage?: string | null;
};
