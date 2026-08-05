# poc-node-backend

Estudos de backend com Node.js — seguindo a estrutura de um curso do zero.

## Progressão

1. **Aula 1** — HTTP nativo (módulo `http`, sem framework)
2. **Aula 2** — `fs`, `path`, `streams` (leitura, escrita, pipe pro response)
3. **Aula 3** — Express + REST CRUD + middleware de logger
4. **Aula 4** — Zod para validação, erros tipados, error middleware global, `dotenv`
5. **Aula 5** — Refactor MVC: `routes/` → `controllers/` → `services/` + middlewares em arquivos próprios
6. **Aula 6** — Persistência SQLite (`better-sqlite3`) + repository pattern
7. **Aula 7** — Testes: Vitest (unit com repo mockado) + supertest (integração) + caminhos de erro
8. **Aula 8** — Autenticação: bcrypt, JWT, middleware `authenticate`, tasks com dono (isolamento entre usuários)

## Estrutura final

```
src/
├── app.ts                       — wiring do Express
├── server.ts                    — servidor com HTTP nativo (aula 1-2)
├── env.ts                       — env vars validadas com Zod
├── errors.ts                    — classes AppError, NotFoundError, ValidationError
├── schemas.ts                   — schemas Zod (source of truth pros tipos)
├── fs-demo.ts                   — laboratório de fs/streams (rodar avulso)
├── db/
│   ├── connection.ts            — singleton do SQLite
│   └── migrate.ts               — schema + seed (rodar com npm run db:migrate)
├── repositories/
│   └── tasks.repository.ts      — SQL puro, prepared statements
├── services/
│   └── tasks.service.ts         — regras de negócio, chama repository
├── controllers/
│   └── tasks.controller.ts      — parse req → service → format res
├── routes/
│   └── tasks.routes.ts          — Router mapeando path → controller
└── middlewares/
    ├── logger.ts
    └── error-handler.ts
```

## Rodar

```bash
npm install
cp .env.example .env
npm run db:migrate    # cria a tabela e insere seed
npm run dev           # Express com hot reload (via tsx watch)
npm test              # suíte completa (Vitest + supertest, banco em memória)

# Ou o servidor HTTP nativo das aulas 1-2:
npm run dev:native
```

> ⚠️ **Vindo da aula 7?** A aula 8 adicionou `tasks.user_id NOT NULL`, e
> `CREATE TABLE IF NOT EXISTS` **não altera tabela que já existe**. Apague o
> banco antes: `rm -f data/tasks.db*` e rode `npm run db:migrate` de novo.
> (É exatamente a dor que Prisma/Drizzle/Knex resolvem com migrations versionadas.)

## Endpoints

Autenticação — públicos:

- `POST   /auth/register` → cria usuário — body: `{ "email": "...", "password": "min 8 chars" }`
- `POST   /auth/login`    → devolve `{ token, user }`

Tasks — **exigem** `Authorization: Bearer <token>`, e cada usuário só enxerga as suas:

- `GET    /tasks`         → lista
- `GET    /tasks/:id`     → busca por id
- `POST   /tasks`         → cria — body: `{ "title": "..." }`
- `PUT    /tasks/:id`     → atualiza — body: `{ "title"?, "done"? }`
- `DELETE /tasks/:id`     → remove

Seed cria `mateus@example.com` / `senha-forte-123`.

```bash
TOKEN=$(curl -s -X POST localhost:3000/auth/login \
  -H 'content-type: application/json' \
  -d '{"email":"mateus@example.com","password":"senha-forte-123"}' | jq -r .token)

curl localhost:3000/tasks -H "Authorization: Bearer $TOKEN"
```

Erros seguem o formato padrão:
```json
{ "error": "NOT_FOUND", "message": "Task não encontrada" }
```
