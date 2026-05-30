import { Suspense } from 'react';
import { useRecoilState, useRecoilValue } from 'recoil';
import { selectedUserIdState, userQuery } from '../state/userQuery';

function UserCard() {
  const id = useRecoilValue(selectedUserIdState);
  // Reading an async selector with useRecoilValue suspends the component
  // until the promise resolves — no loading flags to manage by hand.
  const user = useRecoilValue(userQuery(id));
  return (
    <p>
      #{user.id} — <strong>{user.name}</strong> @ {user.company}
    </p>
  );
}

export function UserPanel() {
  const [id, setId] = useRecoilState(selectedUserIdState);
  return (
    <section>
      <h2>Async selector</h2>
      <button onClick={() => setId((n) => n + 1)}>load user #{id + 1}</button>
      {/* Suspense catches the pending async selector and shows the fallback. */}
      <Suspense fallback={<p>loading user…</p>}>
        <UserCard />
      </Suspense>
    </section>
  );
}
