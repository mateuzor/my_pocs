# 🛠️ Hono + Drizzle + PostgreSQL CRUD API

This is a boilerplate REST API project built with a focus on simplicity, performance, and modern TypeScript tooling. The stack includes:

- [Hono](https://hono.dev) – a lightweight, high-performance web framework
- [Drizzle ORM](https://orm.drizzle.team) – a modern, typesafe SQL-first ORM
- [PostgreSQL](https://www.postgresql.org/) – a robust and widely used relational database

---

## ✨ Stack Overview

### 🔵 Hono

Hono is a minimal web framework for JavaScript/TypeScript, inspired by Express and designed for edge/serverless environments.

**✅ Pros:**

- Extremely fast and lightweight
- First-class TypeScript support
- Web-standard middleware API (fetch-style)
- Great fit for serverless and edge deployments

**⚠️ Cons:**

- Smaller ecosystem than Express or Fastify
- Fewer community-maintained middlewares

**🆚 Alternatives:** Express, Fastify, Koa, NestJS

> Hono outperforms many other frameworks in edge environments and is a solid choice for modern microservices.

---

### 🟡 Drizzle ORM

Drizzle is a SQL-focused ORM that prioritizes type safety and developer experience.

> **What is an ORM?**  
> ORM stands for _Object-Relational Mapping_. It allows developers to interact with the database using code instead of writing raw SQL queries. ORMs provide an abstraction layer over relational databases, mapping tables to objects and rows to instances, which helps reduce boilerplate and ensures better type safety and maintainability in large applications.

**✅ Pros:**

- Full TypeScript support with static typing
- Safe, expressive, and composable SQL queries
- No runtime overhead – lean and fast
- Great autocompletion in modern IDEs

**⚠️ Cons:**

- Lacks some high-level abstractions found in Prisma
- Slightly more verbose for simple use cases

**🆚 Alternatives:** Prisma, TypeORM, Sequelize

> Compared to Prisma, Drizzle gives more control and better performance while maintaining strong type safety.

---

### 🟢 PostgreSQL

PostgreSQL is a powerful open-source relational database, known for reliability, extensibility, and SQL standards compliance.

**✅ Pros:**

- Feature-rich (JSONB, arrays, full-text search)
- ACID compliant
- Huge ecosystem of tools and extensions
- Battle-tested in production

**⚠️ Cons:**

- Can require tuning for high performance
- Initial setup more complex than NoSQL databases

**🆚 Alternatives:** MySQL, SQLite, MongoDB

> PostgreSQL offers advanced features that make it ideal for both small and large applications.

---

## 🚀 Getting Started

1. **Create a local PostgreSQL database** and set your `DATABASE_URL` in `.env`:

   ```
   DATABASE_URL=postgres://user:password@localhost:5432/database_name
   ```

2. **Install dependencies**:

   ```bash
   npm install
   ```

3. **Create the table manually**:

   ```sql
   CREATE TABLE users (
     id SERIAL PRIMARY KEY,
     name TEXT NOT NULL,
     email TEXT NOT NULL
   );
   ```

4. **Run the dev server**:
   ```bash
   npm run dev
   ```

---

## 📮 Available Endpoints

| Method | Route        | Description             | Payload (if applicable)                            |
| ------ | ------------ | ----------------------- | -------------------------------------------------- |
| GET    | `/users`     | List all users          | –                                                  |
| GET    | `/users/:id` | Get a user by ID        | –                                                  |
| POST   | `/users`     | Create a new user       | `{ "name": "John", "email": "john@email.com" }`    |
| PUT    | `/users/:id` | Update an existing user | `{ "name": "New Name", "email": "new@email.com" }` |
| DELETE | `/users/:id` | Delete a user by ID     | –                                                  |

---

## 📚 Key Concepts

- **RESTful API**: resource-oriented endpoints using HTTP verbs
- **CRUD**: Create, Read, Update, Delete operations
- **Type Safety**: compile-time guarantees using TypeScript
- **Middleware**: request/response hooks for parsing, logging, etc.

---

## 📎 Resources

- [Hono Docs](https://hono.dev)
- [Drizzle ORM Docs](https://orm.drizzle.team/docs)
- [PostgreSQL Docs](https://www.postgresql.org/docs/)

---
