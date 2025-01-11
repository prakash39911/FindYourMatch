"use client";

import CardWrapper from "@/components/CardWrapper";
import React, { useState } from "react";
import { GiPadlock } from "react-icons/gi";
import { FieldValues, useForm } from "react-hook-form";
import { ActionResult } from "@/types";
import { generateResetPasswordEmail } from "@/app/actions/authActions";
import { Button, Input } from "@nextui-org/react";
import ResultMessage from "@/components/ResultMessage";

export default function ForgotPasswordForm() {
  const [result, setResult] = useState<ActionResult<string> | null>(null);

  const {
    register,
    handleSubmit,
    reset,
    formState: { isSubmitting, isValid },
  } = useForm();

  const onSubmit = async (data: FieldValues) => {
    setResult(await generateResetPasswordEmail(data.email));
    reset();
  };

  return (
    <>
      <CardWrapper
        headerIcon={GiPadlock}
        headerText="Forgot Passowrd"
        subHeadertext="Please enter your email address and we will send you a link to reset your password"
        body={
          <form
            onSubmit={handleSubmit(onSubmit)}
            className="flex flex-col space-y-4"
          >
            <Input
              type="email"
              placeholder="Email address"
              variant="bordered"
              defaultValue=""
              {...register("email", { required: true })}
            />
            <Button
              type="submit"
              color="secondary"
              isLoading={isSubmitting}
              isDisabled={!isValid}
            >
              Send reset Email
            </Button>
          </form>
        }
        footer={<ResultMessage result={result} />}
      />
    </>
  );
}
