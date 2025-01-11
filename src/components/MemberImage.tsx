"use client";

import { useRole } from "@/hooks/useRole";
import { Button, Image } from "@nextui-org/react";
import { Photo } from "@prisma/client";
import { ImCheckmark } from "react-icons/im";
import { ImCross } from "react-icons/im";

import clsx from "clsx";
import { CldImage } from "next-cloudinary";
import React from "react";
import { useRouter } from "next/navigation";
import { toast } from "react-toastify";
import { approvePhoto, rejectPhoto } from "@/app/actions/adminActions";

type Props = {
  photo: Photo | null;
};

export default function MemberImage({ photo }: Props) {
  const role = useRole();

  const router = useRouter();

  if (!photo) return null;

  const approve = async (photoId: string) => {
    try {
      await approvePhoto(photoId);
      router.refresh();
    } catch (error: any) {
      toast.error(error.message);
    }
  };

  const reject = async (photo: Photo) => {
    try {
      await rejectPhoto(photo);
      router.refresh();
    } catch (error: any) {
      toast.error(error.message);
    }
  };

  return (
    <div>
      {photo?.publicId ? (
        <CldImage
          alt="Image of member"
          src={photo.publicId}
          width={200}
          height={200}
          crop="fill"
          gravity="faces"
          className={clsx("rounded-2xl", {
            "opacity-40": !photo.isApproved && role !== "ADMIN",
          })}
          priority
        />
      ) : (
        <Image
          width={200}
          height={200}
          src={photo?.url || "/images/user.png"}
          alt="image of user"
        />
      )}
      {!photo?.isApproved && role !== "ADMIN" && (
        <div className="absolute bottom-2 w-full bg-slate-200 p-1">
          <div className="flex justify-center text-danger font-semibold">
            Awaiting Approval
          </div>
        </div>
      )}

      {role === "ADMIN" && (
        <div className="flex flex-row gap-2 mt-2">
          <Button
            color="success"
            variant="bordered"
            fullWidth
            onPress={() => approve(photo.id)}
          >
            <ImCheckmark size={20} />
          </Button>
          <Button
            color="danger"
            variant="bordered"
            fullWidth
            onPress={() => reject(photo)}
          >
            <ImCross size={20} />
          </Button>
        </div>
      )}
    </div>
  );
}
