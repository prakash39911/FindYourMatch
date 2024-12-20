"use client";

import { NextUIProvider } from "@nextui-org/react";
import { SessionProvider } from "next-auth/react";
import React from "react";
import { ToastContainer } from "react-toastify";

export default function Provider({ children }: { children: React.ReactNode }) {
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
