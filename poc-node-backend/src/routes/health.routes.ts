import { Router } from 'express';
import { db } from '../db/connection.js';

// Aula 9 — Health checks
//
// São DOIS endpoints diferentes, e confundi-los causa incidente:
//
//   /health  (liveness)  — "o processo está vivo?"
//                          Se falhar, o orquestrador REINICIA o container.
//                          Não pode depender do banco: se o Postgres cair, e o
//                          liveness testar o banco, o Kubernetes fica matando e
//                          recriando uma app que está perfeitamente sã.
//
//   /ready   (readiness) — "posso receber tráfego?"
//                          Se falhar, o load balancer TIRA a instância do
//                          balanceamento (sem matar). Aqui sim testa o banco:
//                          sem banco a app não serve pra nada, mas reiniciar
//                          não resolve.
//
// Nenhum dos dois exige autenticação: quem chama é o orquestrador, não usuário.

export const healthRouter = Router();

const startedAt = Date.now();

healthRouter.get('/health', (_req, res) => {
  res.json({
    status: 'ok',
    uptime: Math.floor((Date.now() - startedAt) / 1000),
  });
});

healthRouter.get('/ready', (_req, res) => {
  try {
    // Query trivial só pra provar que a conexão responde
    db.prepare('SELECT 1').get();
    res.json({ status: 'ready', db: 'up' });
  } catch {
    // 503 = "temporariamente indisponível", que é exatamente o caso.
    res.status(503).json({ status: 'not_ready', db: 'down' });
  }
});
