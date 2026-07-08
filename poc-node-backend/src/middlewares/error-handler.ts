import type { Request, Response, NextFunction } from 'express';
import { ZodError } from 'zod';
import { AppError, NotFoundError, ValidationError } from '../errors.js';
import { env } from '../env.js';

// Aula 5 — Handler de erro em arquivo próprio
// Continua com 4 args (err, req, res, next) para o Express reconhecer.

export function errorHandler(err: unknown, _req: Request, res: Response, _next: NextFunction) {
  if (err instanceof ZodError) {
    const validation = new ValidationError('Payload inválido', err.flatten().fieldErrors);
    return res.status(validation.statusCode).json({
      error: validation.code,
      message: validation.message,
      issues: validation.issues,
    });
  }

  if (err instanceof AppError) {
    return res.status(err.statusCode).json({
      error: err.code,
      message: err.message,
    });
  }

  console.error('Erro inesperado:', err);
  res.status(500).json({
    error: 'INTERNAL_SERVER_ERROR',
    message: env.NODE_ENV === 'production' ? 'Algo deu errado' : String(err),
  });
}

// 404 pra rotas que não casaram com nenhum router
export function notFoundHandler(_req: Request, _res: Response, next: NextFunction) {
  next(new NotFoundError('Rota'));
}
