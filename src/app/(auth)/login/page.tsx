import React from "react";
import { LoginCard } from "./LoginCard";

export default function Login() {
  return (
    <div
      className="flex justify-center items-center"
      style={{ height: "calc(100vh - 64px)" }}
    >
      <LoginCard />
    </div>
  );
}
