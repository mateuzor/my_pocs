import pino from 'pino';
import { env } from './env.js';

// Aula 9 — Logging ESTRUTURADO
//
// O console.log da aula 5 escrevia texto: "← GET /tasks 200 (3ms)". Bonito de
// ler, inútil de consultar. Em produção o log vai pro Datadog/CloudWatch/Loki,
// e lá você quer perguntar coisas como:
//
//   "todas as requests com status >= 500 na última hora"
//   "latência p95 do POST /tasks"
//   "tudo que aconteceu na request X"
//
// Com texto puro isso vira regex frágil. Com JSON, é filtro por campo.
// Por isso logger estruturado emite UM OBJETO por linha (NDJSON).
//
// Pino é o padrão em Node por ser o mais rápido: serializa direto pra buffer
// e escreve de forma assíncrona, sem bloquear o event loop no meio da request.

export const logger = pino({
  // 'silent' nos testes: log de request é ruído que esconde a falha real na
  // saída do Vitest. O logger continua existindo — só não escreve.
  level: env.NODE_ENV === 'test' ? 'silent' : env.LOG_LEVEL,

  // Em desenvolvimento, JSON cru é ilegível no terminal. pino-pretty formata.
  // Em produção NUNCA use pretty: custa CPU e quebra o parsing do coletor.
  transport:
    env.NODE_ENV === 'development'
      ? { target: 'pino-pretty', options: { colorize: true, translateTime: 'HH:MM:ss' } }
      : undefined,

  // REDACT: garante que campo sensível nunca chega no log, mesmo se alguém
  // logar o objeto inteiro por descuido. Defesa em profundidade — a mesma
  // ideia do tipo User sem passwordHash da aula 8, agora na saída de log.
  redact: {
    paths: [
      'req.headers.authorization',
      'req.headers.cookie',
      'password',
      '*.password',
      'passwordHash',
      '*.passwordHash',
    ],
    censor: '[REDACTED]',
  },
});
