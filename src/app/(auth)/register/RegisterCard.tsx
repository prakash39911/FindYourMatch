"use client";

import { RegisterUser } from "@/app/actions/RegisterActions";
import {
  registerSchema,
  registerSchemaType,
} from "@/lib/schemas/RegisterSchema";
import { zodResolver } from "@hookform/resolvers/zod";
import { Button, Card, CardBody, CardHeader, Input } from "@nextui-org/react";
import React from "react";
import { useForm } from "react-hook-form";
import { FaUserLock } from "react-icons/fa";
import { toast } from "react-toastify";

export const RegisterCard = () => {
  const {
    register,
    handleSubmit,
    setError,
    formState: { errors, isValid, isSubmitting },
  } = useForm<registerSchemaType>({
    resolver: zodResolver(registerSchema),
    mode: "onTouched",
  });

  const onSubmit = async (data: registerSchemaType) => {
    const isUserRegistered = await RegisterUser(data);
    if (isUserRegistered.status === "success") {
      toast.success("User Registered Successfully");
    } else {
      if (Array.isArray(isUserRegistered.error)) {
        isUserRegistered.error.forEach((e) => {
          const fieldName = e.path.join(".") as "email" | "name" | "password";
          setError(fieldName, { message: e.message });
        });
      } else {
        setError("root.serverError", { message: isUserRegistered.error });
      }
    }
  };

  return (
    <Card className="w-2/6">
      <CardHeader className="flex justify-center flex-col gap-0.5">
        <div className="flex gap-2 items-center">
          <FaUserLock size={25} />
          <div className="font-bold text-2xl">Register</div>
        </div>
        <p className="text-sm">Welcome to FindMatch</p>
      </CardHeader>
      <CardBody>
        <form className="flex gap-4 flex-col" onSubmit={handleSubmit(onSubmit)}>
          <Input
            label="Name"
            variant="bordered"
            {...register("name")}
            isInvalid={!!errors.name}
            errorMessage={errors?.name?.message}
          />
          <Input
            label="email"
            variant="bordered"
            {...register("email")}
            isInvalid={!!errors.email}
            errorMessage={errors?.email?.message}
          />
          <Input
            label="password"
            type="password"
            {...register("password")}
            isInvalid={!!errors.password}
            errorMessage={errors?.password?.message}
          />
          {errors.root?.serverError && (
            <p className="text-danger text-sm">
              {errors.root.serverError.message}
            </p>
          )}
          <Button
            isLoading={isSubmitting}
            isDisabled={!isValid}
            color="secondary"
            fullWidth
            type="submit"
          >
            Submit
          </Button>
        </form>
      </CardBody>
    </Card>
  );
};
