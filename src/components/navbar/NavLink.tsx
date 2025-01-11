"use client";

import useMessageStore from "@/hooks/useMessageStore";
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

  const unreadCount = useMessageStore((state) => state.unreadCount);

  return (
    <>
      <NavbarItem isActive={currentPath == href} as={Link} href={href}>
        <span>{name}</span>
        {href === "/messages" && unreadCount > 0 && (
          <span className="ml-1">({unreadCount})</span>
        )}
      </NavbarItem>
    </>
  );
}
