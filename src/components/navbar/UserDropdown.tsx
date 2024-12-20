"use client";

import {
  Avatar,
  Dropdown,
  DropdownItem,
  DropdownMenu,
  DropdownSection,
  DropdownTrigger,
} from "@nextui-org/react";
import { Session } from "next-auth";
import { signOut } from "next-auth/react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import React from "react";

type userType = {
  user: Session["user"];
};

export default function UserDropdown({ user }: userType) {
  const router = useRouter();

  return (
    <>
      <Dropdown placement="bottom-start">
        <DropdownTrigger>
          <Avatar as="button" src={user?.image || "/images/user.png"} />
        </DropdownTrigger>
        <DropdownMenu aria-label="User actions menu" variant="flat">
          <DropdownSection showDivider>
            <DropdownItem
              key="user"
              className="font-bold"
              aria-label="user name"
            >
              Signed in As {user?.name}
            </DropdownItem>
          </DropdownSection>

          <DropdownItem key="edit" as={Link} href="/members/edit">
            Edit Profile
          </DropdownItem>
          <DropdownItem
            onPress={() => {
              signOut();
              router.push("/");
            }}
            key="delete"
            className="text-danger"
            color="danger"
          >
            LogOut
          </DropdownItem>
        </DropdownMenu>
      </Dropdown>
    </>
  );
}
