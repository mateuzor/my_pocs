import type { Request, Response, NextFunction, RequestHandler } from 'express';

// Aula 8 — asyncHandler: a pegadinha nº 1 do Express 4
//
// O Express 4 NÃO entende Promise rejeitada. Isto aqui parece certo e não é:
//
//   router.post('/register', async (req, res) => {
//     const user = await authService.register(...);   // se rejeitar...
//     res.status(201).json(user);
//   });
//
// Se o await rejeita, ninguém chama next(err). O error handler global nunca
// roda, a resposta nunca é enviada e a request fica PENDURADA até o timeout
// do cliente. No terminal aparece só um UnhandledPromiseRejection.
//
// Este wrapper resolve: pega a Promise devolvida pelo handler e liga o
// .catch() no next() do Express. Aí o erro segue o mesmo caminho dos
// erros síncronos e cai no errorHandler da aula 4.
//
// (No Express 5 isso passou a ser nativo — mas este projeto está no 4,
// e a maior parte do código Express que existe no mundo também.)

export function asyncHandler(fn: RequestHandler): RequestHandler {
  return (req: Request, res: Response, next: NextFunction) => {
    Promise.resolve(fn(req, res, next)).catch(next);
  };
}
