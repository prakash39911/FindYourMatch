import React from "react";
import MessageSidebar from "./MessageSidebar";
import { getMessagesByContainer } from "../actions/messageAction";
import MessageTable from "./MessageTable";

export default async function Messages({
  searchParams,
}: {
  searchParams: Promise<{ container: string }>;
}) {
  const { container } = await searchParams;
  const { messages, nextCursor } = await getMessagesByContainer(container);

  return (
    <div className="grid grid-cols-10 gap-2 mx-3 h-[80vh] mt-10">
      <div className="col-span-3">
        <MessageSidebar />
      </div>
      <div className="col-span-7">
        <MessageTable initialMessages={messages} nextCursor={nextCursor} />
      </div>
    </div>
  );
}
