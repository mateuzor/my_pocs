import express, { type Request, type Response, type NextFunction } from 'express';

// Aula 3 — Express: primeiro framework HTTP
//
// O que o Express resolve em relação ao http nativo:
//   1. Roteamento por método + path (não precisa mais de if/else)
//   2. Parsing de body JSON (via middleware express.json())
//   3. res.json(obj), res.status(n) — helpers no lugar de writeHead + JSON.stringify
//   4. Middlewares — funções que rodam em cascata (req, res, next)
//   5. Ecossistema gigante de middlewares prontos (cors, helmet, morgan, etc.)

const app = express();
const PORT = 3000;

// -------------------------------------------------------------------
// Middleware GLOBAL — roda em toda request
// -------------------------------------------------------------------

// express.json() parseia bodies com Content-Type: application/json
// e coloca o resultado em req.body. Sem isso, req.body é undefined.
app.use(express.json());

// Middleware customizado de logging — mostra o padrão (req, res, next)
// Se não chamar next(), a requisição TRAVA. É como um pipeline manual.
app.use((req: Request, _res: Response, next: NextFunction) => {
  const start = Date.now();
  console.log(`→ ${req.method} ${req.url}`);
  // Interceptar o 'finish' do response pra logar a duração
  _res.on('finish', () => {
    console.log(`← ${req.method} ${req.url} ${_res.statusCode} (${Date.now() - start}ms)`);
  });
  next();
});

// -------------------------------------------------------------------
// CRUD de tarefas em memória (banco vem na aula 6)
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

// GET /tasks — lista todas
app.get('/tasks', (_req, res) => {
  res.json(tasks);
});

// GET /tasks/:id — busca por id
app.get('/tasks/:id', (req, res) => {
  const id = Number(req.params.id);
  const task = tasks.find((t) => t.id === id);
  if (!task) return res.status(404).json({ error: 'Task não encontrada' });
  res.json(task);
});

// POST /tasks — cria nova
app.post('/tasks', (req, res) => {
  const { title } = req.body ?? {};
  // Validação bem básica — vira Zod na próxima aula
  if (typeof title !== 'string' || title.trim().length === 0) {
    return res.status(400).json({ error: 'title é obrigatório' });
  }
  const task: Task = {
    id: nextId++,
    title: title.trim(),
    done: false,
    createdAt: new Date().toISOString(),
  };
  tasks.push(task);
  // 201 Created é o status correto pra POST que cria recurso
  res.status(201).json(task);
});

// PUT /tasks/:id — atualiza
app.put('/tasks/:id', (req, res) => {
  const id = Number(req.params.id);
  const task = tasks.find((t) => t.id === id);
  if (!task) return res.status(404).json({ error: 'Task não encontrada' });

  const { title, done } = req.body ?? {};
  if (typeof title === 'string') task.title = title.trim();
  if (typeof done === 'boolean') task.done = done;

  res.json(task);
});

// DELETE /tasks/:id — remove
app.delete('/tasks/:id', (req, res) => {
  const id = Number(req.params.id);
  const idx = tasks.findIndex((t) => t.id === id);
  if (idx === -1) return res.status(404).json({ error: 'Task não encontrada' });

  const [removed] = tasks.splice(idx, 1);
  res.json(removed);
});

// -------------------------------------------------------------------
// Handler 404 pra rotas não conhecidas — vai como último middleware
// -------------------------------------------------------------------
app.use((_req, res) => {
  res.status(404).json({ error: 'Rota não encontrada' });
});

app.listen(PORT, () => {
  console.log(`Express rodando em http://localhost:${PORT}`);
  console.log('Rotas:');
  console.log('  GET    /tasks');
  console.log('  GET    /tasks/:id');
  console.log('  POST   /tasks       body: { title }');
  console.log('  PUT    /tasks/:id   body: { title?, done? }');
  console.log('  DELETE /tasks/:id');
});
