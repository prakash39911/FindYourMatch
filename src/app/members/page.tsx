import React from "react";
import { GetMembers } from "../actions/MemberAction";
import MemberCard from "./MemberCard";
import { fetchCurrentUserLikeIds } from "../actions/likeActions";

export default async function page() {
  const members = await GetMembers();
  const likedIds = await fetchCurrentUserLikeIds();

  return (
    <>
      <div className="mt-10 mx-10 grid grid-cols-2 md:grid-cols-6 gap-8">
        {members &&
          members.map((member) => (
            <MemberCard member={member} key={member.id} likeIds={likedIds} />
          ))}
      </div>
    </>
  );
}
