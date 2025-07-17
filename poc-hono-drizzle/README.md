# Hono + Drizzle + PostgreSQL CRUD

Projeto base de API REST usando:
- [Hono](https://hono.dev)
- [Drizzle ORM](https://orm.drizzle.team)
- [PostgreSQL](https://www.postgresql.org/)

### 🚀 Como rodar

1. Crie um banco PostgreSQL local e configure a string no `.env`
2. Instale as dependências:
   ```bash
   npm install
   ```
3. Crie a tabela manualmente:
   ```sql
   CREATE TABLE users (
     id SERIAL PRIMARY KEY,
     name TEXT NOT NULL,
     email TEXT NOT NULL
   );
   ```
4. Rode a API:
   ```bash
   npm run dev
   ```

### Endpoints disponíveis

- `GET /users` – listar todos
- `GET /users/:id` – obter por ID
- `POST /users` – criar (`{ name, email }`)
- `PUT /users/:id` – atualizar
- `DELETE /users/:id` – deletar
