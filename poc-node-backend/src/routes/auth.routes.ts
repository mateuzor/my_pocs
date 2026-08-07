import { Router } from 'express';
import { authController } from '../controllers/auth.controller.js';
import { asyncHandler } from '../middlewares/async-handler.js';
import { authenticate } from '../middlewares/authenticate.js';

// Aula 8 — Rotas de autenticação, montadas em /auth
// Aula 11 — adicionadas /refresh (pública) e /logout (autenticada).

export const authRouter = Router();

// Públicas — rate limit já vem do app.ts (authRateLimit)
authRouter.post('/register', asyncHandler(authController.register));
authRouter.post('/login', asyncHandler(authController.login));
authRouter.post('/refresh', asyncHandler(authController.refresh));

// Logout precisa saber QUEM está deslogando → passa pelo authenticate.
// Aqui o access token ainda tem que ser válido; se você perdeu o access,
// só espera 15 min pra expirar. O refresh já foi revogado do lado do banco.
authRouter.post('/logout', authenticate, asyncHandler(authController.logout));
