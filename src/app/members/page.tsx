import React from "react";
import { GetMembers } from "../actions/MemberAction";
import MemberCard from "./MemberCard";
import { fetchCurrentUserLikeIds } from "../actions/likeActions";
import PaginationComponent from "@/components/PaginationComponent";
import { GetMemberParams } from "@/types";
import EmptyState from "@/components/EmptyState";

export default async function Memberpage({
  searchParams,
}: {
  searchParams: Promise<GetMemberParams>;
}) {
  const params = await searchParams;
  const { items: members, totalCount } = await GetMembers(params);
  const likedIds = await fetchCurrentUserLikeIds();

  return (
    <>
      {!members || members.length === 0 ? (
        <EmptyState />
      ) : (
        <>
          <div className="mt-10 mx-10 grid grid-cols-2 md:grid-cols-6 gap-8">
            {members &&
              members.map((member) => (
                <MemberCard
                  member={member}
                  key={member.id}
                  likeIds={likedIds}
                />
              ))}
          </div>
        </>
      )}

      <PaginationComponent totalCount={totalCount} />
    </>
  );
}
