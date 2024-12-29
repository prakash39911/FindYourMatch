import CardInnerWrapper from "@/components/CardInnerWrapper";
import React from "react";
import ChatForm from "./ChatForm";
import { getMessageThread } from "@/app/actions/messageAction";
import { getCurrentUserId } from "@/app/actions/authActions";
import MessageList from "./MessageList";
import { createChatId } from "@/lib/utils";

export default async function ChatPage({
  params,
}: {
  params: { userId: string };
}) {
  const recipientId = await params;
  const messages = await getMessageThread(recipientId.userId);
  const userId = await getCurrentUserId();
  const chatId = createChatId(userId, recipientId.userId);

  return (
    <CardInnerWrapper
      header="Chat"
      body={
        <MessageList
          initialMessages={messages}
          currentUserId={userId}
          chatId={chatId}
        />
      }
      footer={<ChatForm />}
    />
  );
}
