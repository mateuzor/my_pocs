import { fetchUsers } from "../api.js";

export async function Home() {
  const users = await fetchUsers();

  // Generate user list HTML dynamically
  return `
        <h1>List of Users</h1>
        ${users
          .map(
            (user) => `<div class="card">
                <h2>${user.name}</h2>
                <p>Email: ${user.email}</p>
                <p>Phone: ${user.phone}</p>
                <a href="/user/${user.id}" data-link>View Details</a>
            </div>`
          )
          .join("")}
    `;
}
