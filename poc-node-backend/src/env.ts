import 'dotenv/config';
import { z } from 'zod';

// Aula 4 — Configuração via variáveis de ambiente
//
// PADRÃO: nunca leia `process.env.X` no meio da aplicação. Centralize toda
// leitura aqui, valide com Zod, e exporte um objeto tipado. Se faltar
// uma variável obrigatória, a app quebra NO STARTUP (não em runtime).

const envSchema = z.object({
  // z.coerce.number() converte string → number (env vars são sempre string)
  PORT: z.coerce.number().default(3000),
  NODE_ENV: z.enum(['development', 'test', 'production']).default('development'),
  LOG_LEVEL: z.enum(['debug', 'info', 'warn', 'error']).default('info'),
});

const parsed = envSchema.safeParse(process.env);

if (!parsed.success) {
  console.error('❌ Variáveis de ambiente inválidas:');
  console.error(parsed.error.flatten().fieldErrors);
  process.exit(1);
}

// env é totalmente tipado — TS sabe PORT: number, NODE_ENV: 'development'|'test'|'production'
export const env = parsed.data;
