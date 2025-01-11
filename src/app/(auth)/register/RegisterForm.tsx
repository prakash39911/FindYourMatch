"use client";

import { RegisterUser } from "@/app/actions/authActions";
import {
  profileSchema,
  registerSchema,
  registerSchemaType,
} from "@/lib/schemas/RegisterSchema";
import { handleFormServerErrors } from "@/lib/utils";
import { zodResolver } from "@hookform/resolvers/zod";
import { Button, Card, CardBody, CardHeader } from "@nextui-org/react";
import React, { useState } from "react";
import { FormProvider, useForm } from "react-hook-form";
import { FaUserLock } from "react-icons/fa";
import UserDetailsForm from "./UserDetailsForm";
import ProfileForm from "./ProfileForm";
import { useRouter } from "next/navigation";

const stepSchemas = [registerSchema, profileSchema];

export default function RegisterForm() {
  const router = useRouter();

  const [activeStep, setActiveStep] = useState(0);
  const currentValidationSchema = stepSchemas[activeStep];

  const methods = useForm<registerSchemaType>({
    resolver: zodResolver(currentValidationSchema),
    mode: "onTouched",
  });

  const {
    handleSubmit,
    setError,
    getValues,
    formState: { errors, isValid, isSubmitting },
  } = methods;

  const onSubmit = async () => {
    const result = await RegisterUser(getValues());
    if (result.status === "success") {
      router.push("/register/success");
    } else {
      handleFormServerErrors(result, setError);
    }
  };

  const getStepContent = (step: number) => {
    switch (step) {
      case 0:
        return <UserDetailsForm />;
      case 1:
        return <ProfileForm />;
      default:
        return "unknown step";
    }
  };

  const onBack = () => {
    setActiveStep((prev) => prev - 1);
  };

  const onNext = async () => {
    if (activeStep === stepSchemas.length - 1) {
      await onSubmit();
    } else {
      setActiveStep((prev) => prev + 1);
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
        <FormProvider {...methods}>
          <form className="flex gap-4 flex-col" onSubmit={handleSubmit(onNext)}>
            {getStepContent(activeStep)}
            {errors.root?.serverError && (
              <p className="text-danger text-sm">
                {errors.root.serverError.message}
              </p>
            )}

            <div className="flex flex-row items-center gap-6">
              {activeStep !== 0 && (
                <Button onPress={onBack} fullWidth>
                  Back
                </Button>
              )}

              <Button
                isLoading={isSubmitting}
                isDisabled={!isValid}
                color="secondary"
                fullWidth
                type="submit"
              >
                {activeStep === stepSchemas.length - 1 ? "Submit" : "continue"}
              </Button>
            </div>
          </form>
        </FormProvider>
      </CardBody>
    </Card>
  );
}
