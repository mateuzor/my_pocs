# poc-hono

POC do [Hono](https://hono.dev) — framework HTTP TypeScript-first, ultra-leve
(~14kB), portátil entre runtimes (Node, Bun, Deno, Cloudflare Workers,
Vercel Edge). Escolhido pra comparar com o Express que estava usando nas
últimas semanas e com o Elysia (que já tinha uma POC).

## Rodar

```bash
npm install
npm run dev        # servidor em http://localhost:3000
npm run client     # (em outra aba) exercita o RPC client contra o server
```

## O que a POC cobre

| Aula | Commit | O que aprendi |
|------|--------|---------------|
| 1 | bootstrap | routing + Context imutável + adapter Node |
| 2 | validation | `@hono/zod-validator` + `HTTPException` + `.onError` |
| 3 | rpc | `hc<AppType>` — cliente type-safe derivado dos tipos do servidor |
| 4 | auth | `hono/jwt` built-in + middleware `.use('/tasks/*', jwt(...))` + rate limit in-memory |

## O killer feature: RPC type-safe

O `app` do Hono acumula TIPO conforme você encadeia `.get/.post/...`. Isso
permite:

```ts
// server.ts
export const app = new Hono()
  .post('/tasks', zValidator('json', createTaskSchema), (c) => { ... });
export type AppType = typeof app;

// client.ts — SÓ importa o TIPO
import { hc } from 'hono/client';
import type { AppType } from './app';

const api = hc<AppType>('http://localhost:3000');
await api.tasks.$post({ json: { title: 'x' } });   // autocomplete + type-check
await api.tasks.$post({ json: { titulo: 'x' } });  // ⛔ erro de compilação
```

Renomeou um campo do schema no server → todo consumidor do client quebra a
build. Refactor cross-cliente-servidor com type safety.

## Comparação: Express vs Hono vs Elysia

| Aspecto | Express | **Hono** | Elysia |
|---------|---------|----------|--------|
| Runtime alvo | Node | Node / Bun / Deno / **edge** | Bun (Node via adapter) |
| Bundle size | ~500kB (com deps) | ~14kB | ~50kB |
| API primária | `(req, res, next)` mutável | `Context` imutável + `return c.json(...)` | `Context` + method chaining |
| Web Standards (Request/Response) | ❌ (usa `http` do Node) | ✅ | ✅ |
| Validação | libs externas (Zod + wrapper) | `@hono/zod-validator` (integrado) | TypeBox nativo (`t.Object`) |
| RPC client type-safe | ❌ | ✅ (`hc<AppType>`) | ✅ (Eden) |
| Auth JWT | `jsonwebtoken` + middleware custom | `hono/jwt` built-in | plugin `@elysiajs/jwt` |
| Docs OpenAPI | `swagger-jsdoc` (anotações) | `@hono/zod-openapi` (a partir do Zod) | `@elysiajs/swagger` (auto do schema) |
| Idade / maturidade | 2010 (rock-solid, gigante) | 2022 (crescendo rápido) | 2022 (bem hypado no ecossistema Bun) |
| Ecossistema | Enorme | Média (crescendo) | Pequena mas coesa |

**Quando escolher Hono:**
- Deploy em **edge** (Cloudflare Workers, Vercel Edge) — Express não roda lá
- Time que valoriza **type-safety end-to-end** e não quer duplicar tipos
  entre server e client
- Projeto novo em TypeScript onde bundle size importa

**Quando ficar no Express:**
- App já grande em produção; migrar seria caro sem ganho claro
- Depender de middleware específico Express-only (existe uns 20 anos, tem
  wrapper pra qualquer coisa)
- Time júnior — a documentação e tutoriais do Express são inesgotáveis

**Quando escolher Elysia:**
- Deploy no Bun especificamente — Elysia é otimizado pra ele
- Quer TypeBox em vez de Zod (schemas + JSON Schema nativos)

## O que aprendi comparando com o backend Express

- **Context imutável** força um estilo mais funcional (`return c.json(...)`
  em vez de `res.json(...); return`) — menos bugs de "esqueci o return".
- **Web Standards por baixo** significa que o mesmo código roda em qualquer
  runtime. No Express, migrar pra edge é reescrever.
- **Type-safe RPC** elimina a categoria inteira de bugs de "frontend
  esperava `title` e backend renomeou pra `name`".
- **Middlewares built-in** (logger, jwt, cors, cache, compress) reduzem
  drasticamente a lista de dependências.

Trade-off honesto: ecossistema menor, então pra coisas de nicho
(ex.: Passport strategies) você acaba escrevendo na mão.
