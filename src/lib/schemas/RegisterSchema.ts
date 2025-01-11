import { z } from "zod";
import { CalculateAge } from "../utils";

export const registerSchema = z.object({
  name: z.string().min(3, { message: "minimum length must be 3" }),
  email: z.string().email(),
  password: z.string().min(8, { message: "Min length must be 8" }),
});

export const profileSchema = z.object({
  gender: z.string().min(1),
  description: z.string().min(1),
  city: z.string().min(1),
  country: z.string().min(1),
  dateOfBirth: z
    .string()
    .min(1, { message: "Date of Birth is required" })
    .refine(
      (datestring) => {
        const age = CalculateAge(new Date(datestring));
        return age >= 18;
      },
      {
        message: "You must be atleast 18 to use this app",
      }
    ),
});

export const combinedRegisterSchema = registerSchema.and(profileSchema);

export type ProfileSchemaType = z.infer<typeof profileSchema>;

export type registerSchemaType = z.infer<
  typeof registerSchema & typeof profileSchema
>;
