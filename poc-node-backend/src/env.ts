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
  DATABASE_URL: z.string().default('./data/tasks.db'),

  // Aula 8 — segredo de assinatura do JWT.
  // Sem default de propósito em produção: se faltar, a app não sobe. Um
  // default tipo 'secret' é pior que erro — vira segredo real sem ninguém ver.
  JWT_SECRET: z.string().min(16, 'JWT_SECRET precisa de no mínimo 16 chars')
    .default('dev-only-secret-nao-use-em-prod'),
  JWT_EXPIRES_IN: z.string().default('15m'),

  // Aula 11 — refresh token dura MUITO mais (dias vs minutos). O access
  // token sai curto pra limitar dano se vazar; o refresh compensa deixando
  // o usuário logado por dias sem digitar senha.
  REFRESH_TOKEN_EXPIRES_DAYS: z.coerce.number().int().positive().default(7),
});

const parsed = envSchema.safeParse(process.env);

if (!parsed.success) {
  console.error('❌ Variáveis de ambiente inválidas:');
  console.error(parsed.error.flatten().fieldErrors);
  process.exit(1);
}

// env é totalmente tipado — TS sabe PORT: number, NODE_ENV: 'development'|'test'|'production'
export const env = parsed.data;
