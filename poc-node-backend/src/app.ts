import express from 'express';
import { env } from './env.js';
import { tasksRouter } from './routes/tasks.routes.js';
import { requestLogger } from './middlewares/logger.js';
import { errorHandler, notFoundHandler } from './middlewares/error-handler.js';

// Aula 5 — app.ts vira só o "wiring": monta middlewares + routers.
// Zero regra de negócio, zero validação, zero storage.
// Cada peça responde por uma coisa só.

const app = express();

// Middlewares globais
app.use(express.json());
app.use(requestLogger);

// Routers montados por recurso
app.use('/tasks', tasksRouter);

// 404 + error handler ficam por último
app.use(notFoundHandler);
app.use(errorHandler);

app.listen(env.PORT, () => {
  console.log(`Express (${env.NODE_ENV}) rodando em http://localhost:${env.PORT}`);
});
