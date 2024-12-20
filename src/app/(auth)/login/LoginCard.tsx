"use client";

import { loginSchema, loginSchemaTypes } from "@/lib/schemas/LoginSchema";
import { zodResolver } from "@hookform/resolvers/zod";
import { Button, Card, CardBody, CardHeader, Input } from "@nextui-org/react";
import { signIn } from "next-auth/react";
import { useRouter } from "next/navigation";
import React from "react";
import { useForm } from "react-hook-form";
import { FaUserLock } from "react-icons/fa";
import { toast } from "react-toastify";

export const LoginCard = () => {
  const router = useRouter();

  const {
    register,
    handleSubmit,
    formState: { errors, isValid, isSubmitting },
  } = useForm<loginSchemaTypes>({
    resolver: zodResolver(loginSchema),
    mode: "onTouched",
  });

  const onSubmit = async (data: loginSchemaTypes) => {
    try {
      const result = await signIn("credentials", {
        email: data.email,
        password: data.password,
        redirect: false,
      });
      toast.success("Login Successfull");
      router.push("/");
      router.refresh();
    } catch (error) {
      toast.error(error as string);
    }
  };

  return (
    <Card className="w-2/6">
      <CardHeader className="flex justify-center flex-col gap-0.5">
        <div className="flex gap-2 items-center">
          <FaUserLock size={25} />
          <div className="font-bold text-2xl">Login</div>
        </div>
        <p className="text-sm">Welcome to FindMatch</p>
      </CardHeader>
      <CardBody>
        <form className="flex gap-4 flex-col" onSubmit={handleSubmit(onSubmit)}>
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
