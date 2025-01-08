"use client";

import { usePathname } from "next/navigation";
import React from "react";
import Filter from "./Filter";

export default function FiltersWrapper() {
  const pathname = usePathname();

  if (pathname === "/members") return <Filter />;
  else return null;
}
