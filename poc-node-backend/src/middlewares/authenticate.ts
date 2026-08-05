import type { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import { authService, type TokenPayload } from '../services/auth.service.js';
import { AppError } from '../errors.js';

// Aula 8 — Middleware de autenticação
//
// Fica ANTES do router protegido na cadeia. Se o token não presta, corta a
// request com 401 e o controller nunca roda. Se presta, anexa o usuário em
// req.user e chama next().
//
// Por que middleware e não checagem dentro de cada controller? Porque
// esquecer um `if (!user) return 401` num controller novo é fácil demais.
// Protegendo o router inteiro, a rota nova nasce protegida por padrão.

export class UnauthorizedError extends AppError {
  constructor(message = 'Token ausente ou inválido') {
    super(message, 401, 'UNAUTHORIZED');
  }
}

// Aumenta o tipo Request do Express para conhecer req.user.
// Sem isso o TS reclama de propriedade inexistente em todo controller.
declare global {
  // eslint-disable-next-line @typescript-eslint/no-namespace
  namespace Express {
    interface Request {
      user?: TokenPayload;
    }
  }
}

export function authenticate(req: Request, _res: Response, next: NextFunction) {
  const header = req.headers.authorization;

  // Formato padrão: "Authorization: Bearer <token>" (RFC 6750)
  if (!header?.startsWith('Bearer ')) {
    return next(new UnauthorizedError());
  }

  const token = header.slice('Bearer '.length);

  try {
    req.user = authService.verifyToken(token);
    next();
  } catch (err) {
    // jwt.verify joga TokenExpiredError ou JsonWebTokenError. Traduzimos os
    // dois aqui em vez de deixar vazar pro handler global — senão viraria
    // 500, e "token expirou" não é erro do servidor.
    if (err instanceof jwt.TokenExpiredError) {
      return next(new UnauthorizedError('Token expirado'));
    }
    next(new UnauthorizedError());
  }
}
