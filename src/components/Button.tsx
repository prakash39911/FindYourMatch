"use client";

import { signOut } from "next-auth/react";
import React from "react";

export default function Buttoncomponent() {
  return (
    <div>
      <button
        className="px-2 py-1 bg-black text-white font-bold m-2"
        onClick={() => signOut()}
      >
        SignOut
      </button>
    </div>
  );
}
