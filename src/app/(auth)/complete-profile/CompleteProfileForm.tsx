"use client";

import CardWrapper from "@/components/CardWrapper";
import { profileSchema, ProfileSchemaType } from "@/lib/schemas/RegisterSchema";
import { zodResolver } from "@hookform/resolvers/zod";
import { CgProfile } from "react-icons/cg";

import React from "react";
import { FormProvider, useForm } from "react-hook-form";
import ProfileForm from "../register/ProfileForm";
import { Button } from "@nextui-org/react";
import { completeSocialLoginProfile } from "@/app/actions/authActions";
import { signIn } from "next-auth/react";

export default function CompleteProfileForm() {
  const methods = useForm<ProfileSchemaType>({
    resolver: zodResolver(profileSchema),
    mode: "onTouched",
  });

  const {
    handleSubmit,
    formState: { errors, isSubmitting, isValid },
  } = methods;

  const onSubmit = async (data: ProfileSchemaType) => {
    console.log(data);
    const result = await completeSocialLoginProfile(data);

    if (result.status === "success") {
      signIn(result.data, {
        callbackUrl: "/members",
      });
    }
  };

  return (
    <>
      <CardWrapper
        headerText="About You"
        subHeadertext="Please Complete your profile to continue"
        headerIcon={CgProfile}
        body={
          <FormProvider {...methods}>
            <form
              className="flex gap-4 flex-col"
              onSubmit={handleSubmit(onSubmit)}
            >
              <ProfileForm />
              {errors.root?.serverError && (
                <p className="text-danger text-sm">
                  {errors.root.serverError.message}
                </p>
              )}

              <div className="flex flex-row items-center gap-6">
                <Button
                  isLoading={isSubmitting}
                  isDisabled={!isValid}
                  color="secondary"
                  fullWidth
                  type="submit"
                >
                  Submit
                </Button>
              </div>
            </form>
          </FormProvider>
        }
      />
    </>
  );
}
