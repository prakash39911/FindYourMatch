import { z } from "zod";

export const resetPasswordSchema = z
  .object({
    password: z.string().min(8, {
      message: "Password must be 8 characters",
    }),
    confirmPassword: z.string().min(8),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Password do not match",
    path: ["confirmPassword"],
  });

export type resetPassowrdSchemaType = z.infer<typeof resetPasswordSchema>;
