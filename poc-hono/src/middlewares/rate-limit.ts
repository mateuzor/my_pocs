import type { MiddlewareHandler } from 'hono';
import { HTTPException } from 'hono/http-exception';

// Aula 4 — Rate limit in-memory por IP.
//
// Suficiente pra POC / server único. Em produção com múltiplas instâncias:
//   - `hono-rate-limiter` com backend Redis / Upstash
//   - ou `@hono/rate-limiter` (oficial em beta)
//
// A implementação in-memory NÃO funciona em serverless (cada invocação
// pode ser um processo novo) — outro motivo pra usar Redis lá.

interface Options {
  windowMs: number;
  limit: number;
}

interface Entry {
  count: number;
  resetAt: number;
}

export function rateLimit({ windowMs, limit }: Options): MiddlewareHandler {
  const buckets = new Map<string, Entry>();

  return async (c, next) => {
    // Hono expõe várias formas de pegar o IP. Em produção atrás de proxy,
    // ler `x-forwarded-for`. Aqui uso o header direto — bom pra dev.
    const ip =
      c.req.header('x-forwarded-for')?.split(',')[0]?.trim() ??
      c.req.header('x-real-ip') ??
      'unknown';

    const now = Date.now();
    const entry = buckets.get(ip);

    if (!entry || entry.resetAt < now) {
      buckets.set(ip, { count: 1, resetAt: now + windowMs });
    } else {
      entry.count++;
      if (entry.count > limit) {
        const retryAfter = Math.ceil((entry.resetAt - now) / 1000);
        c.header('Retry-After', String(retryAfter));
        c.header('X-RateLimit-Limit', String(limit));
        c.header('X-RateLimit-Remaining', '0');
        throw new HTTPException(429, { message: 'Rate limit excedido' });
      }
    }

    await next();
  };
}
