import { z } from "zod";

export const loginSchema = z.object({
  email: z.string().email(),
  password: z
    .string()
    .min(8, { message: "Minimum length must be 8 characters" }),
});

export type loginSchemaTypes = z.infer<typeof loginSchema>;
