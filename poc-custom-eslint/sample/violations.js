// Run `npm run lint` to see both custom rules fire on this file.

// local/no-magic-timeout
setTimeout(() => console.log('tick'), 3000);
setInterval(() => console.log('poll'), 250);

// local/no-hardcoded-url (autofixable with `npm run lint:fix`)
export async function loadUsers() {
  const res = await fetch('https://api.example.com/users');
  return res.json();
}

// OK: allowed delay and a named constant
const RETRY_MS = 1000;
setTimeout(() => {}, 0);
setTimeout(() => {}, RETRY_MS);
