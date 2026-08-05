import { createApp } from './app.js';
import { env } from './env.js';
import { logger } from './logger.js';

// Aula 7 — Ponto de entrada do processo.
//
// Este é o único arquivo que abre porta. É o "composition root": junta as
// peças e liga o motor. Nada aqui é importado por testes.

const app = createApp();

app.listen(env.PORT, () => {
  logger.info({ port: env.PORT, env: env.NODE_ENV }, 'servidor no ar');
});
