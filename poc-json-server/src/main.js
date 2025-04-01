const API_URL = "http://localhost:3001/users";
const userList = document.getElementById("user-list");
const form = document.getElementById("user-form");

async function fetchUsers() {
  const res = await fetch(API_URL);
  const users = await res.json();
  renderUsers(users);
}

function renderUsers(users) {
  userList.innerHTML = users.map(user =>
    `<li>
      ${user.name} (${user.email})
      <button onclick="deleteUser(${user.id})">❌</button>
    </li>`
  ).join("");
}

form.addEventListener("submit", async (e) => {
  e.preventDefault();

  const name = document.getElementById("name").value.trim();
  const email = document.getElementById("email").value.trim();

  if (!name || !email) return;

  await fetch(API_URL, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ name, email })
  });

  form.reset();
  fetchUsers();
});

async function deleteUser(id) {
  await fetch(`${API_URL}/${id}`, { method: "DELETE" });
  fetchUsers();
}

fetchUsers();
