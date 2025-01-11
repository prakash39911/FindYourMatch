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
  params: Promise<{ userId: string }>;
}) {
  const { userId } = await params;
  const messages = await getMessageThread(userId);
  const currentUserId = await getCurrentUserId();
  const chatId = createChatId(currentUserId, userId);

  return (
    <CardInnerWrapper
      header="Chat"
      body={
        <MessageList
          initialMessages={messages}
          currentUserId={currentUserId}
          chatId={chatId}
        />
      }
      footer={<ChatForm />}
    />
  );
}
