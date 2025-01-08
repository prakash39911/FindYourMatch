import React from "react";
import ListsTab from "./ListsTab";
import {
  fetchCurrentUserLikeIds,
  fetchLikedMembers,
} from "../actions/likeActions";

export default async function ListsPage({
  searchParams,
}: {
  searchParams: {
    type: string;
  };
}) {
  const SearchParams = await searchParams;
  const likeId = await fetchCurrentUserLikeIds();
  const members = await fetchLikedMembers(SearchParams.type);

  return (
    <>
      <div>
        <ListsTab members={members} likeIds={likeId} />
      </div>
    </>
  );
}
