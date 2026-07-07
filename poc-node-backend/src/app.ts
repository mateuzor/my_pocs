import express, { type Request, type Response, type NextFunction } from 'express';
import { ZodError } from 'zod';
import { env } from './env.js';
import { AppError, NotFoundError, ValidationError } from './errors.js';
import { createTaskSchema, updateTaskSchema } from './schemas.js';

// Aula 4 — Express + Zod + tratamento de erros centralizado
//
// Melhorias em relação à aula 3:
//   - Configuração vem de env.ts (com validação no startup)
//   - Validação de body/params com Zod (não mais if/else na mão)
//   - Erros são lançados como AppError e um middleware final formata a resposta
//   - Async errors funcionam corretamente (asyncHandler wrapper)

const app = express();

app.use(express.json());

// Logger — igual antes
app.use((req: Request, res: Response, next: NextFunction) => {
  const start = Date.now();
  console.log(`→ ${req.method} ${req.url}`);
  res.on('finish', () => {
    console.log(`← ${req.method} ${req.url} ${res.statusCode} (${Date.now() - start}ms)`);
  });
  next();
});

// -------------------------------------------------------------------
// Helper: envolve handlers async pra que erros lançados caiam
// no middleware de erro global (o Express 4 não pega Promise rejection sozinho)
// -------------------------------------------------------------------
type AsyncHandler = (req: Request, res: Response, next: NextFunction) => Promise<unknown>;
const asyncHandler = (fn: AsyncHandler) => (req: Request, res: Response, next: NextFunction) =>
  Promise.resolve(fn(req, res, next)).catch(next);

// -------------------------------------------------------------------
// Storage em memória (banco vem na aula 6)
// -------------------------------------------------------------------
interface Task {
  id: number;
  title: string;
  done: boolean;
  createdAt: string;
}

const tasks: Task[] = [
  { id: 1, title: 'Estudar Node', done: true, createdAt: new Date().toISOString() },
  { id: 2, title: 'Fazer POC de backend', done: false, createdAt: new Date().toISOString() },
];
let nextId = 3;

// -------------------------------------------------------------------
// Rotas — usando Zod pra validar. Se der pau, o ZodError vai pro handler global.
// -------------------------------------------------------------------

app.get('/tasks', (_req, res) => {
  res.json(tasks);
});

app.get('/tasks/:id', (req, res) => {
  const id = Number(req.params.id);
  const task = tasks.find((t) => t.id === id);
  // Em vez de `return res.status(404)...`, lanço um erro tipado.
  // O middleware final cuida de virar HTTP response.
  if (!task) throw new NotFoundError('Task');
  res.json(task);
});

app.post('/tasks', (req, res) => {
  // .parse() joga ZodError se inválido — o middleware de erro pega
  const input = createTaskSchema.parse(req.body);

  const task: Task = {
    id: nextId++,
    title: input.title,
    done: false,
    createdAt: new Date().toISOString(),
  };
  tasks.push(task);
  res.status(201).json(task);
});

app.put('/tasks/:id', (req, res) => {
  const id = Number(req.params.id);
  const task = tasks.find((t) => t.id === id);
  if (!task) throw new NotFoundError('Task');

  const input = updateTaskSchema.parse(req.body);
  if (input.title !== undefined) task.title = input.title;
  if (input.done !== undefined) task.done = input.done;

  res.json(task);
});

app.delete('/tasks/:id', (req, res) => {
  const id = Number(req.params.id);
  const idx = tasks.findIndex((t) => t.id === id);
  if (idx === -1) throw new NotFoundError('Task');

  const [removed] = tasks.splice(idx, 1);
  res.json(removed);
});

// -------------------------------------------------------------------
// 404 pra rotas desconhecidas (antes do error handler)
// -------------------------------------------------------------------
app.use((_req, _res, next) => {
  next(new NotFoundError('Rota'));
});

// -------------------------------------------------------------------
// Middleware de erro GLOBAL — tem 4 args (err, req, res, next) para o
// Express reconhecer como error handler. É o ÚLTIMO middleware.
// -------------------------------------------------------------------
app.use((err: unknown, _req: Request, res: Response, _next: NextFunction) => {
  // Erros de validação do Zod
  if (err instanceof ZodError) {
    const validation = new ValidationError('Payload inválido', err.flatten().fieldErrors);
    return res.status(validation.statusCode).json({
      error: validation.code,
      message: validation.message,
      issues: validation.issues,
    });
  }

  // Erros esperados da app (NotFoundError, ValidationError, etc.)
  if (err instanceof AppError) {
    return res.status(err.statusCode).json({
      error: err.code,
      message: err.message,
    });
  }

  // Qualquer outra coisa é um bug — log completo, resposta genérica
  console.error('Erro inesperado:', err);
  res.status(500).json({
    error: 'INTERNAL_SERVER_ERROR',
    message: env.NODE_ENV === 'production' ? 'Algo deu errado' : String(err),
  });
});

app.listen(env.PORT, () => {
  console.log(`Express (${env.NODE_ENV}) rodando em http://localhost:${env.PORT}`);
});

// asyncHandler exportado — vai ser usado na aula 5 quando os handlers virarem async
export { asyncHandler };
