import { Button, Navbar, NavbarBrand, NavbarContent } from "@nextui-org/react";
import Link from "next/link";
import React from "react";
import { DiCodeigniter } from "react-icons/di";
import NavLink from "./NavLink";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/authOptions";
import UserDropdown from "./UserDropdown";

export const TopNavBar = async () => {
  const session = await getServerSession(authOptions);
  return (
    <div>
      <Navbar
        className="bg-gradient-to-r from-blue-900 to-blue-950"
        maxWidth="xl"
        classNames={{
          item: [
            "text-xl",
            "text-white",
            "uppercase",
            "data-[active=true]:text-yellow-400",
          ],
        }}
      >
        <NavbarBrand
          className="text-3xl font-bold text-white cursor-pointer"
          as={Link}
          href="/"
        >
          <div>
            <DiCodeigniter size={40} />
          </div>
          <div>FindMatch</div>
        </NavbarBrand>
        <NavbarContent justify="center">
          <NavLink href="/members" name="members" />
          <NavLink href="/lists" name="lists" />
          <NavLink href="/messages" name="messages" />
        </NavbarContent>

        <NavbarContent justify="end">
          {session?.user ? (
            <UserDropdown user={session?.user} />
          ) : (
            <>
              <Button as={Link} href="/login">
                Login
              </Button>
              <Button as={Link} href="/register">
                Register
              </Button>
            </>
          )}
        </NavbarContent>
      </Navbar>
    </div>
  );
};
