"use client";

import { NavbarItem } from "@nextui-org/react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import React from "react";

type props = {
  href: string;
  name: string;
};

export default function NavLink({ href, name }: props) {
  const currentPath = usePathname();

  return (
    <>
      <NavbarItem isActive={currentPath == href} as={Link} href={href}>
        {name}
      </NavbarItem>
    </>
  );
}
