const API_URL = "https://jsonplaceholder.typicode.com/users";

export async function fetchUsers() {
  const response = await fetch(API_URL);
  return response.json();
}

export async function fetchUser(id) {
  const response = await fetch(`${API_URL}/${id}`);
  return response.json();
}
