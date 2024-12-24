"use client";

import { createMessage } from "@/app/actions/messageAction";
import { messageSchema, messageSchemaType } from "@/lib/schemas/messageSchema";
import { handleFormServerErrors } from "@/lib/utils";
import { zodResolver } from "@hookform/resolvers/zod";
import { Button, Input } from "@nextui-org/react";
import { useParams, useRouter } from "next/navigation";
import React, { useEffect } from "react";
import { useForm } from "react-hook-form";
import { RxPaperPlane } from "react-icons/rx";

export default function ChatForm() {
  const router = useRouter();
  const params = useParams<{ userId: string }>();

  const {
    register,
    handleSubmit,
    setError,
    reset,
    setFocus,
    formState: { isSubmitting, isValid, errors },
  } = useForm<messageSchemaType>({
    resolver: zodResolver(messageSchema),
  });

  useEffect(() => {
    setFocus("text");
  }, [setFocus]);

  const onSubmit = async (data: messageSchemaType) => {
    const result = await createMessage(params.userId, data);

    if (result.status === "error") {
      handleFormServerErrors(result, setError);
    } else {
      reset();
      router.refresh();
      setTimeout(() => setFocus("text"), 50);
    }
  };

  return (
    <>
      <form onSubmit={handleSubmit(onSubmit)} className="w-full">
        <div className="flex items-center gap-2">
          <Input
            fullWidth
            placeholder="Type a message"
            variant="faded"
            {...register("text")}
            isInvalid={!!errors.text}
            errorMessage={errors.text?.message}
          />
          <Button
            type="submit"
            isIconOnly
            color="secondary"
            radius="full"
            isLoading={isSubmitting}
            isDisabled={!isValid || isSubmitting}
          >
            <RxPaperPlane size={20} />
          </Button>
        </div>
        <div className="flex flex-col">
          {errors.root?.serverError && (
            <p className="text-danger text-sm">
              {errors.root.serverError.message}
            </p>
          )}
        </div>
      </form>
    </>
  );
}
