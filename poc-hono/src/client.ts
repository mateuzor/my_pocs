import { hc } from 'hono/client';
import type { AppType } from './app.js';

// Aula 3 — RPC client TYPE-SAFE
//
// ESTE é o killer feature do Hono e o que o coloca ao lado do tRPC.
//
// O truque: `app.ts` exporta `AppType = typeof app`. Como o Hono acumula tipo
// a cada rota encadeada, `AppType` é literalmente a especificação da API em
// TIPO. O `hc<AppType>(url)` gera um cliente onde CADA endpoint aparece como
// método com:
//   - URL correta (autocomplete)
//   - body/params tipados a partir do Zod schema da rota
//   - resposta tipada
// TUDO derivado dos tipos do servidor — nada gerado por codegen, nada duplicado.
//
// Se você mudar um schema de rota no server, o CÓDIGO CLIENTE que consumia
// esse endpoint quebra o build imediatamente. Refactor com type safety
// atravessando cliente-servidor.
//
// Rodar isolado: `tsx src/client.ts` (com o server no ar).

const api = hc<AppType>('http://localhost:3000');

async function main() {
  console.log('--- GET /tasks ---');
  // api.tasks.$get() — tipado. `res` é Response, `.json()` retorna Task[].
  const listRes = await api.tasks.$get();
  const list = await listRes.json();
  console.log(list); // TypeScript sabe: { id: number; title: string; done: boolean }[]

  console.log('\n--- POST /tasks ---');
  // O `json` aqui é validado em TIPO contra o createTaskSchema do server.
  // Tentar passar `{ titulo: 'x' }` (typo) = erro de compilação.
  const created = await api.tasks.$post({ json: { title: 'Criada via RPC' } });
  console.log(await created.json());

  console.log('\n--- GET /tasks/:id ---');
  // Params tipados também — a URL é construída pelo client.
  const one = await api.tasks[':id'].$get({ param: { id: '1' } });
  if (one.status === 404) {
    // Tipado como { error: string } via HTTPException path
    console.log('não achou');
  } else {
    console.log(await one.json());
  }

  console.log('\n--- Erro de tipo (comentado):');
  console.log("   api.tasks.$post({ json: { titulo: 'x' } })  // erro de compilação");
}

main().catch(console.error);
