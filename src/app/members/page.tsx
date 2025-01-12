import React from "react";
import MemberCard from "./MemberCard";
import { fetchCurrentUserLikeIds } from "../actions/likeActions";
import PaginationComponent from "@/components/PaginationComponent";
import { GetMemberParams } from "@/types";
import EmptyState from "@/components/EmptyState";
import { GetMembers } from "../actions/MemberAction";

export default async function MembersPage({
  searchParams,
}: {
  searchParams: Promise<GetMemberParams>;
}) {
  const { ageRange, gender, orderBy, pageNumber, pageSize, withPhoto } =
    await searchParams;
  const { items: members, totalCount } = await GetMembers({
    ageRange,
    gender,
    orderBy,
    pageNumber,
    pageSize,
    withPhoto,
  });
  const likeIds = await fetchCurrentUserLikeIds();

  return (
    <>
      {!members || members.length === 0 ? (
        <EmptyState />
      ) : (
        <>
          <div className="mt-10 grid grid-cols-2 md:grid-cols-3 xl:grid-cols-6 gap-8">
            {members &&
              members.map((member) => (
                <MemberCard member={member} key={member.id} likeIds={likeIds} />
              ))}
          </div>
          <PaginationComponent totalCount={totalCount} />
        </>
      )}
    </>
  );
}
