import { atom } from 'jotai';

// ASYNC ATOMS — an atom whose getter returns a Promise.
// Jotai integrates with React Suspense: components reading this atom
// AUTOMATICALLY suspend until the Promise resolves. No isLoading state to
// thread through props.

interface User {
  id: number;
  name: string;
  email: string;
}

// Plain writable atom holding the selected user id
export const selectedUserIdAtom = atom<number>(1);

// Async derived atom — refetches whenever selectedUserIdAtom changes.
// The component reading `userAtom` will Suspense until the fetch resolves.
export const userAtom = atom(async (get) => {
  const id = get(selectedUserIdAtom);
  await new Promise((r) => setTimeout(r, 600)); // simulate network latency
  const res = await fetch(`https://jsonplaceholder.typicode.com/users/${id}`);
  if (!res.ok) throw new Error(`Failed to load user ${id}`);
  return (await res.json()) as User;
});

// Synchronous derived atom that depends on the async atom.
// Jotai propagates the Promise correctly — this atom only resolves once
// userAtom resolves. The chain is fully reactive.
export const userInitialsAtom = atom(async (get) => {
  const user = await get(userAtom);
  return user.name
    .split(' ')
    .map((part) => part[0])
    .join('')
    .toUpperCase();
});
