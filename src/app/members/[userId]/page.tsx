import { getMemberByUserId } from "@/app/actions/MemberAction";
import CardInnerWrapper from "@/components/CardInnerWrapper";
import { notFound } from "next/navigation";

export default async function MemberDetailsPage({
  params,
}: {
  params: Promise<{ userId: string }>;
}) {
  const { userId } = await params;
  const member = await getMemberByUserId(userId);
  if (!member) return notFound();

  return (
    <CardInnerWrapper header="Profile" body={<div>{member.description}</div>} />
  );
}
