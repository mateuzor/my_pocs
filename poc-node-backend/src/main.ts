import { createApp } from './app.js';
import { env } from './env.js';

// Aula 7 — Ponto de entrada do processo.
//
// Este é o único arquivo que abre porta. É o "composition root": junta as
// peças e liga o motor. Nada aqui é importado por testes.

const app = createApp();

app.listen(env.PORT, () => {
  console.log(`Express (${env.NODE_ENV}) rodando em http://localhost:${env.PORT}`);
});
