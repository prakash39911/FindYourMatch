import React from "react";
import { RegisterCard } from "./RegisterCard";

export default function Register() {
  return (
    <div
      className="flex justify-center items-center"
      style={{ height: "calc(100vh - 64px)" }}
    >
      <RegisterCard />
    </div>
  );
}
