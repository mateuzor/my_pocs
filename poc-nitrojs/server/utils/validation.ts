import { z } from "zod";

export const createTodoSchema = z.object({
  todo: z.string().min(1),
  completed: z
    .union([z.literal("true"), z.literal("false")])
    .optional()
    .default("false"),
});

export const patchTodoSchema = z.object({
  todo: z.string().min(1).optional(),
  completed: z.union([z.literal("true"), z.literal("false")]).optional(),
});
