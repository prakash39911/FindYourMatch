import { GetMemberDetails } from "@/app/actions/MemberAction";
import React, { ReactNode } from "react";
import { notFound } from "next/navigation";
import MemberSidebar from "../MemberSidebar";
import { Card } from "@nextui-org/react";

export default async function Layout({
  children,
  params,
}: {
  children: ReactNode;
  params: { userId: string };
}) {
  const { userId } = await params;
  const member = await GetMemberDetails(userId);
  if (!member) return notFound();

  return (
    <div className="grid grid-cols-10 gap-2 mx-3 h-[80vh]">
      <div className="col-span-3">
        <MemberSidebar member={member} />
      </div>
      <div className="col-span-7">
        <Card className="w-full mt-10 h-[80vh]">{children}</Card>
      </div>
    </div>
  );
}
