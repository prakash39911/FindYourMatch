"use client";

import { Tab, Tabs } from "@nextui-org/react";
import { Member } from "@prisma/client";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import React, { Key, useTransition } from "react";
import MemberCard from "../members/MemberCard";
import LoadingComponent from "@/components/LoadingComponent";

type Props = {
  members: Member[];
  likeIds: string[];
};

export default function ListsTab({ members, likeIds }: Props) {
  const searchParams = useSearchParams();
  const router = useRouter();
  const pathname = usePathname();
  const [isPending, startTransition] = useTransition();

  const tabs = [
    { id: "source", label: "Members i have liked" },
    { id: "target", label: "Members that liked me" },
    { id: "mutual", label: "Mutual Likes" },
  ];

  function handleTabChange(key: Key) {
    startTransition(() => {
      const params = new URLSearchParams(searchParams);
      params.set("type", key.toString());
      router.replace(`${pathname}?${params.toString()}`);
    });
  }

  return (
    <div className="flex w-full flex-col mt-10 gap-5">
      <Tabs
        aria-label="Like tabs"
        items={tabs}
        color="secondary"
        onSelectionChange={(key) => handleTabChange(key)}
      >
        {(item) => {
          return (
            <Tab key={item.id} title={item.label}>
              {isPending ? (
                <div>
                  <LoadingComponent />
                </div>
              ) : (
                <>
                  {members.length > 0 ? (
                    <div className="mt-10 mx-10 grid grid-cols-2 md:grid-cols-6 gap-8">
                      {members.map((member) => (
                        <MemberCard
                          key={member.id}
                          member={member}
                          likeIds={likeIds}
                        />
                      ))}
                    </div>
                  ) : (
                    <div>No Members for this Filter</div>
                  )}
                </>
              )}
            </Tab>
          );
        }}
      </Tabs>
    </div>
  );
}
