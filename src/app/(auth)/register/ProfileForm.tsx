"use client";

import { Input, Select, SelectItem, Textarea } from "@nextui-org/react";
import { format, subYears } from "date-fns";
import React from "react";
import { useFormContext } from "react-hook-form";

export default function ProfileForm() {
  const {
    register,
    getValues,
    setValue,
    formState: { errors },
  } = useFormContext();

  const genderList = [
    { label: "Male", value: "male" },
    { label: "Female", value: "female" },
  ];

  return (
    <div className="space-y-4">
      <Select
        label="Gender"
        variant="bordered"
        defaultSelectedKeys={getValues("gender")}
        aria-label="Select Gender"
        {...register("gender")}
        isInvalid={!!errors.gender}
        errorMessage={errors?.gender?.message as string}
        onChange={(e) => setValue("gender", e.target.value)}
      >
        {genderList.map((item) => (
          <SelectItem key={item.value} value={item.value}>
            {item.label}
          </SelectItem>
        ))}
      </Select>
      <Input
        label="Date of birth"
        variant="bordered"
        type="date"
        max={format(subYears(new Date(), 18), "yyyy-MM-dd")}
        defaultValue={getValues("dateOfBirth")}
        {...register("dateOfBirth")}
        isInvalid={!!errors.dateOfBirth}
        errorMessage={errors?.dateOfBirth?.message as string}
      />
      <Textarea
        label="Description"
        defaultValue={getValues("description")}
        {...register("description")}
        isInvalid={!!errors.description}
        errorMessage={errors?.description?.message as string}
      />
      <Input
        label="City"
        variant="bordered"
        defaultValue={getValues("city")}
        {...register("city")}
        isInvalid={!!errors.city}
        errorMessage={errors?.city?.message as string}
      />
      <Input
        label="Country"
        variant="bordered"
        defaultValue={getValues("country")}
        {...register("country")}
        isInvalid={!!errors.country}
        errorMessage={errors?.country?.message as string}
      />
    </div>
  );
}
