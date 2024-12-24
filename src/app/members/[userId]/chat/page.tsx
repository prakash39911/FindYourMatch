import CardInnerWrapper from "@/components/CardInnerWrapper";
import React from "react";
import ChatForm from "./ChatForm";
import { getMessageThread } from "@/app/actions/messageAction";
import MessageBox from "./MessageBox";
import { getCurrentUserId } from "@/app/actions/authActions";

export default async function ChatPage({
  params,
}: {
  params: { userId: string };
}) {
  const messages = await getMessageThread(params.userId);
  const userId = await getCurrentUserId();

  const body =
    messages.length === 0 ? (
      "No messages to diplay"
    ) : (
      <div>
        {messages.map((message) => (
          <MessageBox
            key={message.id}
            message={message}
            currentUserId={userId}
          />
        ))}
      </div>
    );

  return <CardInnerWrapper header="Chat" body={body} footer={<ChatForm />} />;
}
