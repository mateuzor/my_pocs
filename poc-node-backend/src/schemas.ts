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

// Aula 8 — Schemas de autenticação
//
// A regra de senha forte vive AQUI, não espalhada em ifs pelo controller.
// Trocar a política (ex.: exigir símbolo) = mexer numa linha só.
export const registerSchema = z.object({
  email: z.string().trim().toLowerCase().email('email inválido'),
  password: z.string().min(8, 'senha precisa de no mínimo 8 caracteres').max(72),
  // 72 é o limite do bcrypt: bytes além disso são silenciosamente ignorados.
  // Sem esse max, "senha de 100 chars" e "os mesmos 72 primeiros" logariam igual.
});

export const loginSchema = z.object({
  email: z.string().trim().toLowerCase().email(),
  password: z.string().min(1, 'senha obrigatória'),
});

export type RegisterInput = z.infer<typeof registerSchema>;
export type LoginInput = z.infer<typeof loginSchema>;
