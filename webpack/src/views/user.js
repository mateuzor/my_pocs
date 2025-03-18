import { fetchUser } from "../api.js";

export async function User(id) {
  const user = await fetchUser(id);
  // Generate user details page dynamically
  return `
        <h1>${user.name}</h1>
        <p><strong>Email:</strong> ${user.email}</p>
        <p><strong>Phone:</strong> ${user.phone}</p>
        <p><strong>Company:</strong> ${user.company.name}</p>
        <p><strong>Address:</strong> ${user.address.street}, ${user.address.city}</p>
        <a href="/" data-link>Back</a>
    `;
}
