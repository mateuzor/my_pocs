import express, { type Express } from 'express';
import swaggerUi from 'swagger-ui-express';
import { tasksRouter } from './routes/tasks.routes.js';
import { authRouter } from './routes/auth.routes.js';
import { attachmentsRouter } from './routes/attachments.routes.js';
import { requestLogger } from './middlewares/logger.js';
import { errorHandler, notFoundHandler } from './middlewares/error-handler.js';
import { securityHeaders, generalRateLimit, authRateLimit } from './middlewares/security.js';
import { openApiSpec } from './openapi.js';

// Aula 5 — app.ts é o "wiring": monta middlewares + routers.
// Zero regra de negócio, zero validação, zero storage.
//
// Aula 7 — EXPORTA o app em vez de subir servidor (pra testes usarem sem porta).
//
// Aula 10 — adicionadas camadas de segurança:
//   1. Helmet (headers de segurança) ANTES de tudo
//   2. Rate limit geral aplicado ao app inteiro
//   3. Rate limit AGRESSIVO especificamente no /auth (anti brute force)
// Ordem importa: security headers → rate limit → parsing → rotas → 404 → erro.

export function createApp(): Express {
  const app = express();

  // Segurança PRIMEIRO — headers e rate limit rejeitam ANTES de parse/log,
  // pra não gastar CPU processando requests que vão ser bloqueadas.
  app.use(securityHeaders);
  app.use(generalRateLimit);

  // Middlewares globais
  app.use(express.json());
  app.use(requestLogger);

  // Aula 14 — Docs interativos em /docs
  // A spec em si fica em /docs.json (útil pra codegen de clients externos).
  // NÃO passa por auth pra times conseguirem explorar sem token no dev.
  // Em produção, considere proteger ou desabilitar essa rota inteira.
  app.get('/docs.json', (_req, res) => res.json(openApiSpec));
  app.use('/docs', swaggerUi.serve, swaggerUi.setup(openApiSpec));

  // Routers montados por recurso.
  // /auth leva o rate limit extra ANTES do router — regra dele fica local.
  app.use('/auth', authRateLimit, authRouter);
  app.use('/tasks', tasksRouter);
  app.use(attachmentsRouter); // rotas com prefixo próprio (/tasks/:id/attachments e /attachments/:id)

  // 404 + error handler ficam por último
  app.use(notFoundHandler);
  app.use(errorHandler);

  return app;
}
