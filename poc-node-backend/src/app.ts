import express, { type Express } from 'express';
import { tasksRouter } from './routes/tasks.routes.js';
import { authRouter } from './routes/auth.routes.js';
import { requestLogger } from './middlewares/logger.js';
import { errorHandler, notFoundHandler } from './middlewares/error-handler.js';

// Aula 5 — app.ts é o "wiring": monta middlewares + routers.
// Zero regra de negócio, zero validação, zero storage.
//
// Aula 7 — agora EXPORTA o app em vez de subir servidor.
//
// Por que separar? Um teste de integração precisa do app montado, e não de
// uma porta aberta. Enquanto app.ts chamava app.listen() no topo, qualquer
// `import` do arquivo — inclusive o do teste — subia um servidor de verdade:
// porta ocupada, processo que não encerra, testes que penduram.
//
// Regra geral: o módulo que CONSTRÓI e o módulo que EXECUTA são separados.
// Quem escuta a porta agora é o main.ts.

export function createApp(): Express {
  const app = express();

  // Middlewares globais
  app.use(express.json());
  app.use(requestLogger);

  // Routers montados por recurso
  app.use('/auth', authRouter);
  app.use('/tasks', tasksRouter);

  // 404 + error handler ficam por último
  app.use(notFoundHandler);
  app.use(errorHandler);

  return app;
}
