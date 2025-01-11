import React from "react";
import RegisterForm from "./RegisterForm";

export default function Register() {
  return (
    <div
      className="flex justify-center items-center"
      style={{ height: "calc(100vh - 64px)" }}
    >
      <RegisterForm />
    </div>
  );
}
