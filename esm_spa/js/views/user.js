import { fetchUser } from "../api.js";

export async function User(id) {
  const user = await fetchUser(id);

  return `
        <h1>${user.name}</h1>
        <p><strong>Email:</strong> ${user.email}</p>
        <p><strong>Telefone:</strong> ${user.phone}</p>
        <p><strong>Empresa:</strong> ${user.company.name}</p>
        <p><strong>Endereço:</strong> ${user.address.street}, ${user.address.city}</p>
        <a href="/" data-link>Voltar</a>
    `;
}
