"use client";

import { getUnreadMessageCount } from "@/app/actions/messageAction";
import useMessageStore from "@/hooks/useMessageStore";
import { useNotificationChannel } from "@/hooks/useNotificationChannel";
import { usePresenceChannel } from "@/hooks/usePresenceChannel";
import { NextUIProvider } from "@nextui-org/react";
import { SessionProvider } from "next-auth/react";
import React, { useCallback, useEffect, useRef } from "react";
import { ToastContainer } from "react-toastify";

export default function Provider({
  profileComplete,
  children,
  userId,
}: {
  profileComplete: boolean;
  children: React.ReactNode;
  userId: string | null;
}) {
  const isUnreadCountSet = useRef(false);

  const updateUnreadCount = useMessageStore((state) => state.updateUnreadCount);

  const setUnreadCount = useCallback(
    (amount: number) => {
      updateUnreadCount(amount);
    },
    [updateUnreadCount]
  );

  useEffect(() => {
    if (!isUnreadCountSet.current && userId) {
      getUnreadMessageCount().then((count) => setUnreadCount(count));
    }
    isUnreadCountSet.current = true;
  }, [setUnreadCount, userId]);

  usePresenceChannel(userId, profileComplete);
  useNotificationChannel(userId, profileComplete);
  return (
    <>
      <SessionProvider>
        <NextUIProvider>
          <ToastContainer
            position="bottom-right"
            hideProgressBar
            className="z-50"
          />
          {children}
        </NextUIProvider>
      </SessionProvider>
    </>
  );
}
