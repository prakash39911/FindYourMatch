"use client";

import { Input } from "@nextui-org/react";
import React from "react";
import { useFormContext } from "react-hook-form";

export default function UserDetailsForm() {
  const {
    register,
    getValues,
    formState: { errors },
  } = useFormContext();

  return (
    <div className="space-y-4">
      <Input
        label="Name"
        variant="bordered"
        defaultValue={getValues("name")}
        {...register("name")}
        isInvalid={!!errors.name}
        errorMessage={errors?.name?.message as string}
      />
      <Input
        label="email"
        variant="bordered"
        defaultValue={getValues("email")}
        {...register("email")}
        isInvalid={!!errors.email}
        errorMessage={errors?.email?.message as string}
      />
      <Input
        label="password"
        type="password"
        defaultValue={getValues("password")}
        {...register("password")}
        isInvalid={!!errors.password}
        errorMessage={errors?.password?.message as string}
      />
    </div>
  );
}
