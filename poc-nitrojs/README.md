# poc-nitrojs-todos

A proof of concept (PoC) project built with **[Nitro.js](https://nitro.unjs.io)** — the universal server engine created by the [UnJS](https://unjs.io) team.
This demo implements a fully functional **Todo API** showcasing **file-based routing**, **TypeScript support**, **caching**, and an **explicit Unstorage-based persistence layer** instead of relying on Nitro runtime globals.

---

## 📘 Overview

Nitro.js is a lightweight, high-performance server framework that powers [Nuxt 3](https://nuxt.com) and can also be used standalone.
It enables developers to create universal JavaScript applications that can run in multiple environments — Node.js, serverless functions, service workers, and more.

This PoC demonstrates how to:

- Create RESTful routes using **file-based routing**.
- Use **Unstorage** with the `fs` driver to persist data locally.
- Implement full **CRUD** operations for a Todo list.
- Enable **caching** using Nitro’s `routeRules`.
- Write fully typed, explicit server-side logic with `h3` helpers (`defineEventHandler`, `readBody`, `getRouterParam`, etc.).

---

## ⚙️ Features

| Feature                      | Description                                                                  |
| ---------------------------- | ---------------------------------------------------------------------------- |
| 🧩 **Zero Configuration**    | Nitro projects work out-of-the-box with TypeScript, hot reload, and routing. |
| 🌍 **Universal Deployment**  | Deploy the same codebase to Node, Vercel, Cloudflare, Netlify, or Workers.   |
| 🗾 **Unstorage Integration** | Explicit file-based KV storage layer (`.data/kv`) for persistence.           |
| 🧠 **TypeScript-first**      | Fully typed API using `Todo` and `KVSchema` interfaces.                      |
| ⚡ **Auto Imports + HMR**    | Fast development workflow with Hot Module Reloading.                         |
| 🤀 **File-based Routing**     | Routes defined by file names under `server/routes`.                          |
| 🥮 **Built-in Caching**      | `routeRules` caching for performance (e.g., `/stats`).                       |

---

## 🧱 Project Structure

```
poc-nitrojs-todos/
├── nitro.config.ts
├── package.json
├── tsconfig.json
├── server/
│   ├── routes/
│   │   ├── index.ts
│   │   ├── stats.get.ts
│   │   ├── todos.get.ts
│   │   ├── todos.post.ts
│   │   └── todos/
│   │       ├── [id].get.ts
│   │       ├── [id].patch.ts
│   │       └── [id].delete.ts
│   └── utils/
│       ├── index.ts         # Todo type definition
│       └── kv.ts            # Unstorage wrapper + helpers
└── README.md
```

---

## 🧩 Core Code Example

### `server/utils/kv.ts`

```ts
import { createStorage } from "unstorage";
import fsDriver from "unstorage/drivers/fs";
import type { Todo } from "./index";

type KVSchema = { todos: Todo[] };

export const kv = createStorage<KVSchema>({
  driver: fsDriver({ base: ".data/kv" }),
});

export async function readTodos(): Promise<Todo[]> {
  return (await kv.getItem("todos")) ?? [];
}

export async function writeTodos(items: Todo[]): Promise<void> {
  await kv.setItem("todos", items);
}
```

### `server/routes/todos.post.ts`

```ts
import type { Todo } from "../utils";
import { defineEventHandler, readBody, setResponseStatus } from "h3";
import { readTodos, writeTodos } from "../utils/kv";

export default defineEventHandler(async (event) => {
  const { todo, completed } = await readBody(event);
  if (!todo || completed == null) {
    setResponseStatus(event, 400);
    return {
      statusCode: 400,
      message: "Both Todo and Completed fields should have a value set",
    };
  }

  const completedStr = String(completed);
  if (completedStr !== "true" && completedStr !== "false") {
    setResponseStatus(event, 400);
    return {
      statusCode: 400,
      message: "The value of completed must either be true or false",
    };
  }

  const list: Todo[] = await readTodos();
  const newTodo: Todo = {
    id: Date.now(),
    todo: String(todo),
    completed: completedStr as "true" | "false",
  };
  list.push(newTodo);
  await writeTodos(list);

  setResponseStatus(event, 201);
  return { statusCode: 201, message: "Todo added successfully", data: newTodo };
});
```

---

## 🚀 Getting Started

### 1️⃣ Install dependencies

```bash
npm install
```

### 2️⃣ Start the development server

```bash
npm run dev
```

By default, it runs on:
🔘 [http://localhost:3000](http://localhost:3000)

### 3️⃣ Try the routes

| Method   | Route        | Description          |
| -------- | ------------ | -------------------- |
| `GET`    | `/todos`     | List all todos       |
| `POST`   | `/todos`     | Create a new todo    |
| `GET`    | `/todos/:id` | Get a single todo    |
| `PATCH`  | `/todos/:id` | Update a todo        |
| `DELETE` | `/todos/:id` | Delete a todo        |
| `GET`    | `/stats`     | Cached route example |

---

## 🤪 Pros & Cons

### ✅ Pros

- **Universal deployment**: works anywhere (Vercel, Cloudflare, Node, Workers).
- **Zero-config TypeScript**: built-in support.
- **Auto-imports**: less boilerplate.
- **File-based routing**: intuitive structure.
- **Unstorage integration**: explicit, runtime-agnostic KV persistence.
- **Built-in caching**: easily configurable per route.
- **Great DX**: HMR, typed handlers, and small footprint.

### ⚠️ Cons

- Not as mature as Express/Koa for massive ecosystems.
- Limited middleware libraries (uses h3-style API).
- Some globals (`useStorage`, etc.) exist only when using full Nitro CLI (not bare modules).
- Slightly different debugging approach than typical Node servers.

---

## 🏗️ Real-World Use Cases

- 🗾 **Internal APIs** for microservices or backend-for-frontend (BFF) setups.
- 🌍 **Serverless functions** deployed to Vercel, Netlify, or AWS Lambda.
- 🧪 **Prototyping** universal JS APIs with minimal setup.
- 🧊 **Custom server engines** for frameworks (Nuxt 3 already uses Nitro).
- ⚙️ **Edge rendering** or pre-processing of API requests with built-in caching.

---

## 🛂 Deployment Example (Vercel)

Nitro has first-class support for Vercel.
To deploy:

```bash
git init
git add .
git commit -m "init poc-nitrojs-todos"
vercel
```

Then in your Vercel dashboard:

- Add **KV Storage** (optional if you want remote persistence).
- Redeploy.

---

## 🤌 Conclusion

Nitro.js redefines what a modern server-side toolkit can be — **portable, efficient, and developer-centric**.
By leveraging the UnJS ecosystem and TypeScript-first design, it offers an ergonomic alternative to traditional Node frameworks.

This PoC shows how simple it is to build a persistent CRUD API with no external database — just a file-based KV layer — and still enjoy type safety, caching, and cross-platform deployment.

> **Author:** Mateus Ramos (Full-Stack Engineer)
> **Project:** `poc-nitrojs-todos` > **Stack:** Nitro.js · TypeScript · Unstorage · h3 · Node.js
