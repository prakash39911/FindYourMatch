import React from "react";
import { GetMembers } from "../actions/MemberAction";
import MemberCard from "./MemberCard";

export default async function page() {
  const data = await GetMembers();

  return (
    <>
      <div className="mt-10 mx-10 grid grid-cols-1 md:grid-cols-6 gap-8">
        {data &&
          data.map((member) => <MemberCard member={member} key={member.id} />)}
      </div>
    </>
  );
}
