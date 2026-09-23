import { useEffect, useState } from 'react';

interface User {
  id: number;
  name: string;
}

type State = { status: 'loading' } | { status: 'error'; message: string } | { status: 'ready'; users: User[] };

export function UserList() {
  const [state, setState] = useState<State>({ status: 'loading' });

  useEffect(() => {
    let cancelled = false;
    fetch('/api/users')
      .then((r) => {
        if (!r.ok) throw new Error(`HTTP ${r.status}`);
        return r.json() as Promise<User[]>;
      })
      .then((users) => !cancelled && setState({ status: 'ready', users }))
      .catch((e: Error) => !cancelled && setState({ status: 'error', message: e.message }));
    return () => {
      cancelled = true;
    };
  }, []);

  if (state.status === 'loading') return <p>Loading users...</p>;
  if (state.status === 'error') return <p role="alert">Failed: {state.message}</p>;
  return (
    <ul aria-label="users">
      {state.users.map((u) => (
        <li key={u.id}>{u.name}</li>
      ))}
    </ul>
  );
}
