import React, { ReactNode } from "react";
import MemberSidebar from "../MemberSidebar";
import { Card } from "@nextui-org/react";
import { getCurrentUserId } from "@/app/actions/authActions";
import prisma from "@/lib/PrismaClient";
import { notFound } from "next/navigation";

export default async function Layout({ children }: { children: ReactNode }) {
  const userId = await getCurrentUserId();
  const member = await prisma.member.findUnique({
    where: {
      userId,
    },
  });

  if (!member) return notFound();

  const basePath = `/members/edit`;

  const navLinks = [
    { name: "Edit Profile", href: `${basePath}` },
    { name: "Update Photos", href: `${basePath}/photos` },
  ];

  return (
    <div className="grid grid-cols-10 gap-2 mx-3 h-[80vh]">
      <div className="col-span-3">
        <MemberSidebar member={member} navLinks={navLinks} />
      </div>
      <div className="col-span-7">
        <Card className="w-full mt-10 h-[80vh]">{children}</Card>
      </div>
    </div>
  );
}
