import { fetchUsers } from "../api.js";

export async function Home() {
  const users = await fetchUsers();

  return `
        <h1>Lista de Usuários</h1>
        ${users
          .map(
            (user) => `<div class="card">
                <h2>${user.name}</h2>
                <p>Email: ${user.email}</p>
                <p>Telefone: ${user.phone}</p>
                <a href="/user/${user.id}" data-link>Ver detalhes</a>
            </div>`
          )
          .join("")}
    `;
}
