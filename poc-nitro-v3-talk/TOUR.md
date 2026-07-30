# Roteiro do código — o que abrir, em que ordem, e o que falar

Instruções em português; **as falas em inglês são pra dizer literalmente.**

> **O código entra em um único momento: slide 6, aos 1:57.** Dura 110 segundos —
> é o maior bloco da apresentação. Antes disso você só mostra código em slide
> (slide 5, aos 1:35, como preview).

**Setup:** `cd poc-nitro-v3-talk && code .`
O workspace já vem com fonte 18, minimap desligado e `node_modules` escondido,
então a árvore mostra exatamente os 7 arquivos.

---

## ⚠️ Antes de entrar no slide 6

Num terminal separado, **dispare já**:

```bash
./demo.sh build-all
```

Leva 30–40s e é o seu encerramento. Se você só rodar quando chegar no beat 3,
fica parado esperando na frente de todos.

---

## Beat 0 — a árvore (10s)

Sidebar aberta. Aponta pra `server/`.

> **"Seven files. That's the entire server — routing, caching, auth, storage."**

`Cmd+B` pra esconder a sidebar. Não demore aqui.

---

## Beat 1 — `server/api/stars/[...repo].ts` (35s) ← o ponto alto

Abre o arquivo. Deixa a plateia ler um segundo, então:

> **"The filename is the route. Square-bracket-dot-dot-dot repo is a catch-all,
> so slash api slash stars slash nitrojs slash nitro arrives as one string."**

Aponta pro `defineCachedFunction`:

> **"This wrapper is the whole caching story. Look at what is NOT here: no redis
> client, no connection string, no invalidation logic. It's backed by the storage
> layer — files on disk in dev, Redis or Workers KV in prod, changed in config."**

**Agora vai pro browser** (`localhost:3100`) e clica em **Fetch stars**:

- 1ª linha: laranja, `~250–360 ms`, **NETWORK**
- clica de novo: verde, `<1 ms`, **CACHE**
- clica **×10**: uma parede de verde

> **"Three hundred milliseconds to zero point four. Same handler. The only
> thing I added was that wrapper."**

**Fale o número que estiver na SUA tela.** Eu medi de 123 a 359 ms em execuções
diferentes — é variação de rede, não do cache.

---

## Beat 2 — `nitro.config.ts` (30s)

Volta pro editor. Este é o arquivo que surpreende as pessoas.

Aponta pro `routeRules`:

> **"This is not application code. It's config. CORS, caching, a proxy, and HTTP
> basic auth — declared against URL patterns. Nitro compiles these into whatever
> the target understands: real CDN headers on Vercel, a `_headers` file on
> Netlify, runtime middleware on Node."**

Agora a consequência, no terminal:

```bash
./demo.sh auth
```

Dá `401`, depois carrega a página.

> **"That admin route has a password. Now watch —"**

Abre `server/routes/admin/index.ts` (15 linhas, cabe inteiro na tela):

> **"— zero lines of auth code in the handler. It's four words in a config file."**

**Beat opcional (5s):** se sobrar tempo, roda `./demo.sh time` — o relógio
congela, e `server/api/time.ts` não tem nada além de `new Date()`.

---

## Beat 3 — o fechamento: cinco presets (25s)

Volta pro terminal onde você disparou o `build-all`.

> **"Same source files. The only thing that changed is one environment variable.
> Node, Cloudflare, Vercel, Deno, Bun — five real builds."**

Aponta pros tamanhos:

> **"Notice Cloudflare is smaller than Node — unenv stripped the Node
> compatibility layer it doesn't need there. Each target gets its own build."**

---

## Cartão de consulta

```
  Cmd+B, aponta server/         ->  "seven files"
  abre stars/[...repo].ts       ->  "no redis client"
  browser: Fetch stars, x10     ->  "~300 ms to 0.4"
  abre nitro.config.ts          ->  "this is config, not code"
  ./demo.sh auth                ->  401 então 200
  abre routes/admin/index.ts    ->  "zero auth code"
  terminal do build-all         ->  cinco presets   [dispare no começo!]
```

**Se estourar o tempo:** corta o `./demo.sh time`. **Nunca corte o beat 1**
(o cache) **nem o beat 3** (os presets).

---

## Como treinar

1. Roda `./demo.sh all` uma vez, só pra ver tudo funcionando ponta a ponta.
2. Faz a demo inteira **com cronômetro**, sem os slides. Alvo: 110s.
   Passou de 130s? Corta o beat opcional e faz o beat 0 em 5s.
3. Repete **com o Presenter View aberto** — o resumo deste roteiro está nas
   speaker notes do slide 6, então na hora você não precisa trocar de janela.
4. Ensaia a **troca de janelas**: editor → browser → editor → terminal.
   É onde a maioria das demos trava. Deixe as três já posicionadas antes.

**Teste o projetor da sala.** Os 4 arquivos foram enxugados pra caber inteiros
em fonte 18. Se você aumentar a fonte na hora (`Cmd+=`), o
`stars/[...repo].ts` passa a exigir scroll — descubra isso antes, não no palco.

---

## Arquivos que você NÃO vai abrir (mas pode, se perguntarem)

| Arquivo | Se alguém perguntar sobre… |
|---|---|
| `server/api/hello.get.ts` / `.post.ts` | routing por método no nome do arquivo, `HTTPError` |
| `server/api/visits.ts` | `useStorage()` — KV sem provisionar nada |
| `server/api/time.ts` | cache por route rule, do ponto de vista do handler |
| `server/middleware/1.timing.ts` | middleware auto-registrado, ordem numérica |
| `public/index.html` | o dashboard em si (HTML puro, sem framework) |

---

## Se o editor te sabotar

- Fonte pequena pro fundo da sala? **Cmd+=** duas vezes (mas veja o aviso acima).
- Caiu no Zen mode sem querer? **Cmd+K Z** alterna.
- Sidebar no caminho? **Cmd+B**.
- Janela errada no projetor? **Não conserte ao vivo** — fale por cima e use o
  slide 5, que tem os mesmos dois trechos de código.
- Nada funciona? O slide 4 tem todos os números de build. Você consegue entregar
  a apresentação inteira só pelos slides.
