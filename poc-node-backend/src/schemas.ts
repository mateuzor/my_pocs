import { z } from 'zod';

// Aula 4 — Schemas de validação com Zod
//
// PADRÃO: um schema por payload. O mesmo schema:
//   1. valida em runtime (parse joga se inválido, safeParse retorna Result)
//   2. gera o tipo TypeScript via z.infer<typeof schema> — uma fonte só

export const createTaskSchema = z.object({
  title: z.string().trim().min(1, 'title não pode ser vazio').max(200),
});

export const updateTaskSchema = z.object({
  title: z.string().trim().min(1).max(200).optional(),
  done: z.boolean().optional(),
});

// Tipos gerados automaticamente do schema — a fonte da verdade é o schema
export type CreateTaskInput = z.infer<typeof createTaskSchema>;
export type UpdateTaskInput = z.infer<typeof updateTaskSchema>;
