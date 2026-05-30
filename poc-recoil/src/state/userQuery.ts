import { atom, selectorFamily } from 'recoil';

interface User {
  id: number;
  name: string;
  company: string;
}

// Fake API — resolves after a delay so the Suspense fallback is visible.
async function fetchUser(id: number): Promise<User> {
  await new Promise((r) => setTimeout(r, 700));
  return { id, name: `User ${id}`, company: `Acme ${id}` };
}

// Which user is currently selected (plain writable atom).
export const selectedUserIdState = atom<number>({
  key: 'selectedUserIdState',
  default: 1,
});

// An ASYNC selector: its `get` returns a Promise. Recoil treats the pending
// promise as a Suspense boundary and the resolved value as cached derived
// state — re-selecting an already-fetched id is instant (no second request).
// selectorFamily parameterizes the selector by argument (the user id).
export const userQuery = selectorFamily<User, number>({
  key: 'userQuery',
  get: (id) => async () => fetchUser(id),
});
