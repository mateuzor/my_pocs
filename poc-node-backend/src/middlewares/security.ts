import helmet from 'helmet';
import rateLimit from 'express-rate-limit';

// Aula 10 — Segurança básica que TODA API pública precisa ter.
//
// 1. HELMET
// Coleção de ~15 middlewares que setam headers de segurança sensatos:
//   - Strict-Transport-Security (força HTTPS)
//   - X-Content-Type-Options: nosniff (evita MIME sniffing)
//   - X-Frame-Options: DENY (anti-clickjacking)
//   - Content-Security-Policy (default seguro)
//   - Referrer-Policy, X-DNS-Prefetch-Control, etc.
// Não tem NENHUM motivo pra não usar. É defesa em profundidade grátis.
export const securityHeaders = helmet();

// 2. RATE LIMIT
// Duas políticas: uma folgada pra API em geral, uma AGRESSIVA pro /auth.
// Rate limit no /auth é o que impede ataques de credential stuffing e brute-force.
// Sem isso, um atacante pode testar milhões de senhas contra /auth/login.
//
// PADRÃO: chave por IP. Em produção atrás de proxy (nginx/CDN), configurar
// `app.set('trust proxy', true)` — senão TODO tráfego vira o IP do proxy.

// API geral — 100 req/min por IP. Suficiente pra uso normal, corta abuso.
export const generalRateLimit = rateLimit({
  windowMs: 60 * 1000,          // 1 minuto
  limit: 100,
  standardHeaders: 'draft-7',   // RateLimit-* headers padronizados
  legacyHeaders: false,         // desliga X-RateLimit-* antigos
  message: { error: 'RATE_LIMITED', message: 'Muitas requisições, tente daqui a pouco' },
});

// Auth — 5 tentativas em 15 min. Login + register + refresh entram aqui.
// O ganho de bloquear brute force compensa muito o inconveniente ocasional.
export const authRateLimit = rateLimit({
  windowMs: 15 * 60 * 1000,     // 15 minutos
  limit: 5,
  standardHeaders: 'draft-7',
  legacyHeaders: false,
  // Só conta tentativas que falharam — sucesso não gasta o "orçamento"
  skipSuccessfulRequests: true,
  message: {
    error: 'AUTH_RATE_LIMITED',
    message: 'Muitas tentativas de autenticação. Tente novamente em 15 minutos.',
  },
});
