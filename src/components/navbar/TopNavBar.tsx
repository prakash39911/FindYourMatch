import { Button, Navbar, NavbarBrand, NavbarContent } from "@nextui-org/react";
import Link from "next/link";
import React from "react";
import { DiCodeigniter } from "react-icons/di";
import NavLink from "./NavLink";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/authOptions";
import UserDropdown from "./UserDropdown";
import { getuserInfoForNav } from "@/app/actions/userActions";
import FiltersWrapper from "./FiltersWrapper";

export const TopNavBar = async () => {
  const session = await getServerSession(authOptions);
  const userInfo = session?.user && (await getuserInfoForNav());

  const memberLinks = [
    { href: "/members", label: "Matches" },
    { href: "/lists", label: "Lists" },
    { href: "/messages", label: "Messages" },
  ];

  const adminLinks = [{ href: "/admin/moderation", label: "Photo Moderation" }];

  const links = session?.user.role === "ADMIN" ? adminLinks : memberLinks;

  return (
    <>
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
            {links.map((item) => (
              <NavLink href={item.href} name={item.label} key={item.label} />
            ))}
          </NavbarContent>

          <NavbarContent justify="end">
            {userInfo ? (
              <UserDropdown user={userInfo} />
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
        <FiltersWrapper />
      </div>
    </>
  );
};
