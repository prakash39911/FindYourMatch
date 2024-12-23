"use client";

import LikeButton from "@/components/LikeButton";
import { CalculateAge, transformImageUrl } from "@/lib/utils";
import { Card, CardFooter, Image } from "@nextui-org/react";
import { Member } from "@prisma/client";
import Link from "next/link";
import React from "react";

type props = {
  member: Member;
  likeIds: string[];
};

export default function MemberCard({ member, likeIds }: props) {
  const hasLiked = likeIds.includes(member.userId);
  const preventLinkAction = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
  };

  return (
    <Card fullWidth as={Link} href={`/members/${member.userId}`} isPressable>
      <Image
        isZoomed
        alt={member.name}
        width={300}
        src={transformImageUrl(member?.image) || "/images/user.png"}
        className="aspect-square object-cover"
      />

      <div onClick={preventLinkAction}>
        <div className="absolute top-3 right-3 z-50">
          <LikeButton targetId={member.userId} hasLiked={hasLiked} />
        </div>
      </div>

      <CardFooter className="flex justify-start overflow-hidden absolute bottom-0 z-10 bg-transparent">
        <div className="flex flex-col text-white">
          <span className="font-bold text-md">
            {member.name}, {CalculateAge(member.dateOfBirth)}
          </span>
          <span className="text-sm">{member.city}</span>
        </div>
      </CardFooter>
    </Card>
  );
}
