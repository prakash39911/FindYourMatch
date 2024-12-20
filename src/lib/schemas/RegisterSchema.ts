import { z } from "zod";

export const registerSchema = z.object({
  name: z.string().min(3, { message: "minimum length must be 3" }),
  email: z.string().email(),
  password: z.string().min(8, { message: "Min length must be 8" }),
});

export type registerSchemaType = z.infer<typeof registerSchema>;
