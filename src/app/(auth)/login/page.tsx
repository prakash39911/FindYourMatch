import React from "react";
import { LoginForm } from "./LoginForm";

export default function Login() {
  return (
    <div
      className="flex justify-center items-center"
      style={{ height: "calc(100vh - 64px)" }}
    >
      <LoginForm />
    </div>
  );
}
