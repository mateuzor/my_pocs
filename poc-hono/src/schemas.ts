import { z } from 'zod';

// Aula 2 — Schemas Zod, mesmo padrão do backend Express (source of truth
// pra validação E tipos). O que muda no Hono é COMO plugar no handler.

export const createTaskSchema = z.object({
  title: z.string().trim().min(1).max(200),
});

export const updateTaskSchema = z.object({
  title: z.string().trim().min(1).max(200).optional(),
  done: z.boolean().optional(),
});

export const taskIdParamSchema = z.object({
  // params vêm sempre como string — z.coerce converte
  id: z.coerce.number().int().positive(),
});

export type CreateTaskInput = z.infer<typeof createTaskSchema>;
export type UpdateTaskInput = z.infer<typeof updateTaskSchema>;
