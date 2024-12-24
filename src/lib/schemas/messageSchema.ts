import { z } from "zod";

export const messageSchema = z.object({
  text: z.string().min(1, {
    message: "Content is required",
  }),
});

export type messageSchemaType = z.infer<typeof messageSchema>;
