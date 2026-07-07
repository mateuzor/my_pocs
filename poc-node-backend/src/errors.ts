// Aula 4 — Classes de erro personalizadas
//
// PADRÃO: em vez de espalhar `res.status(...).json(...)` pela app inteira,
// as camadas de serviço só lançam erros tipados. Um middleware global no
// final da cadeia converte cada tipo no status HTTP correto.

// Base — todos os erros da app herdam disso, então dá pra distinguir
// erros esperados (bugs de domínio) de erros inesperados (throw genérico).
export class AppError extends Error {
  constructor(
    message: string,
    public readonly statusCode: number,
    public readonly code: string
  ) {
    super(message);
    this.name = this.constructor.name;
  }
}

export class NotFoundError extends AppError {
  constructor(resource: string) {
    super(`${resource} não encontrado`, 404, 'NOT_FOUND');
  }
}

export class ValidationError extends AppError {
  constructor(message: string, public readonly issues: unknown) {
    super(message, 400, 'VALIDATION_ERROR');
  }
}
