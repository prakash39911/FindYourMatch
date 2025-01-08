import {
  deleteMessage,
  getMessagesByContainer,
} from "@/app/actions/messageAction";
import { MessageDTO } from "@/types";
import { useSearchParams } from "next/navigation";
import { useRouter } from "next/navigation";
import { useState, useCallback, Key, useEffect, useRef } from "react";
import useMessageStore from "./useMessageStore";

export const useMessages = (
  initialMessages: MessageDTO[],
  nextCursor?: string
) => {
  const cursorRef = useRef(nextCursor);

  const set = useMessageStore((state) => state.set);
  const messages = useMessageStore((state) => state.messages);
  const updateUnreadCount = useMessageStore((state) => state.updateUnreadCount);
  const remove = useMessageStore((state) => state.remove);
  const resetMessages = useMessageStore((state) => state.resetMessages);

  const [loadingMore, setLoadingMore] = useState(false);

  const searchParams = useSearchParams();
  const router = useRouter();
  const [isdeleting, setDeleting] = useState({
    id: "",
    loading: false,
  });
  const isOutbox = searchParams.get("container") === "outbox";
  const container = searchParams.get("container");

  useEffect(() => {
    set(initialMessages);
    cursorRef.current = nextCursor;

    return () => {
      resetMessages();
    };
  }, [initialMessages, resetMessages, set, nextCursor]);

  const loadMore = useCallback(async () => {
    if (cursorRef.current) {
      setLoadingMore(true);
      const { messages, nextCursor } = await getMessagesByContainer(
        container,
        cursorRef.current
      );
      set(messages);
      cursorRef.current = nextCursor;
      setLoadingMore(false);
    }
  }, [container, set]);

  const columns = [
    {
      key: isOutbox ? "recipientName" : "senderName",
      label: isOutbox ? "Recipient" : "sender",
    },
    {
      key: "text",
      label: "Message",
    },
    { key: "created", label: isOutbox ? "Date sent" : "Date received" },
    { key: "actions", label: "Actions" },
  ];

  const handleDeleteMessage = useCallback(
    async (message: MessageDTO) => {
      setDeleting({ id: message.id, loading: true });
      await deleteMessage(message.id, isOutbox);
      remove(message.id);
      if (!message.dateRead && !isOutbox) {
        updateUnreadCount(-1);
      }
      setDeleting({ id: "", loading: false });
    },
    [isOutbox, remove, updateUnreadCount]
  );

  const handleRowSelect = (key: Key) => {
    const message = messages.find((m) => m.id === key);

    const url = isOutbox
      ? `/members/${message?.recipientId}`
      : `/members/${message?.senderId}`;

    router.push(url + "/chat");
  };

  return {
    isOutbox,
    columns,
    deleteMessage: handleDeleteMessage,
    selectRow: handleRowSelect,
    isdeleting,
    messages,
    loadMore,
    loadingMore,
    hasMore: !!cursorRef.current,
  };
};
