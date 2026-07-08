import type { Request, Response, NextFunction } from 'express';

// Aula 5 — Middleware extraído pra arquivo próprio
// Só o log — sem lógica de negócio.

export function requestLogger(req: Request, res: Response, next: NextFunction) {
  const start = Date.now();
  console.log(`→ ${req.method} ${req.url}`);
  res.on('finish', () => {
    console.log(`← ${req.method} ${req.url} ${res.statusCode} (${Date.now() - start}ms)`);
  });
  next();
}
