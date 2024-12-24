"use client";

import { MessageDTO } from "@/types";
import {
  Avatar,
  Button,
  Card,
  Table,
  TableBody,
  TableCell,
  TableColumn,
  TableHeader,
  TableRow,
} from "@nextui-org/react";
import { useRouter, useSearchParams } from "next/navigation";
import React, { Key, useCallback, useState } from "react";
import { AiFillDelete } from "react-icons/ai";
import { deleteMessage } from "../actions/messageAction";
import { truncateString } from "@/lib/utils";

type Props = {
  messages: MessageDTO[];
};

export default function MessageTable({ messages }: Props) {
  const searchParams = useSearchParams();
  const router = useRouter();
  const [isdeleting, setDeleting] = useState({
    id: "",
    loading: false,
  });

  const isOutbox = searchParams.get("container") === "outbox";

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
      router.refresh();
      setDeleting({ id: "", loading: false });
    },
    [isOutbox, router]
  );

  const handleRowSelect = (key: Key) => {
    const message = messages.find((m) => m.id === key);

    const url = isOutbox
      ? `/members/${message?.recipientId}`
      : `/members/${message?.senderId}`;

    router.push(url + "/chat");
  };

  const renderCell = useCallback(
    (item: MessageDTO, columnKey: keyof MessageDTO) => {
      const cellValue = item[columnKey];

      switch (columnKey) {
        case "recipientName":
        case "senderName":
          return (
            <div className="flex items-center gap-2 cursor-pointer ">
              <Avatar
                alt="Image of Member"
                src={
                  (isOutbox ? item.recipientImage : item.senderImage) ||
                  "/images/user.png"
                }
              />
              <span>{cellValue}</span>
            </div>
          );
        case "text":
          return <div>{truncateString(cellValue, 70)}</div>;
        case "created":
          return cellValue;
        default:
          return (
            <Button
              isIconOnly
              variant="light"
              onPress={() => handleDeleteMessage(item)}
              isLoading={isdeleting.id === item.id && isdeleting.loading}
            >
              <AiFillDelete size={24} className="text-danger" />
            </Button>
          );
      }
    },
    [isOutbox, isdeleting.id, isdeleting.loading, handleDeleteMessage]
  );

  return (
    <Card className="flex flex-col gap-3 h-[80vh] overflow-auto">
      <Table
        aria-label="Table with messages"
        selectionMode="single"
        onRowAction={(key) => handleRowSelect(key)}
        shadow="none"
      >
        <TableHeader columns={columns}>
          {(column) => (
            <TableColumn
              key={column.key}
              width={column.key === "text" ? "50%" : undefined}
            >
              {column.label}
            </TableColumn>
          )}
        </TableHeader>
        <TableBody
          items={messages}
          emptyContent="No messages for this container"
        >
          {(item) => (
            <TableRow key={item.id} className="cursor-pointer">
              {(columnKey) => (
                <TableCell
                  className={`${
                    !item.dateRead && !isOutbox ? "font-semibold" : ""
                  }`}
                >
                  {renderCell(item, columnKey as keyof MessageDTO)}
                </TableCell>
              )}
            </TableRow>
          )}
        </TableBody>
      </Table>
    </Card>
  );
}
