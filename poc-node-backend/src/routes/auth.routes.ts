import { Router } from 'express';
import { authController } from '../controllers/auth.controller.js';
import { asyncHandler } from '../middlewares/async-handler.js';

// Aula 8 — Rotas de autenticação, montadas em /auth

export const authRouter = Router();

// asyncHandler é obrigatório: o controller é async (bcrypt).
authRouter.post('/register', asyncHandler(authController.register));
