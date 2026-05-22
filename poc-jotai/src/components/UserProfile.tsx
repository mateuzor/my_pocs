import { Suspense } from 'react';
import { useAtom, useAtomValue } from 'jotai';
import { selectedUserIdAtom, userAtom, userInitialsAtom } from '../atoms/async';

// Async atoms integrate with React Suspense out of the box.
// The component that READS the async atom suspends until the Promise resolves.
// The PARENT wraps it in <Suspense> to render a fallback while it suspends.

function UserCard() {
  // useAtomValue on an async atom returns the RESOLVED value — no isLoading,
  // no error state to check. Errors propagate to error boundaries.
  // This component would otherwise be straightforward synchronous code.
  const user = useAtomValue(userAtom);
  const initials = useAtomValue(userInitialsAtom);

  return (
    <div
      style={{
        display: 'flex',
        gap: '1rem',
        alignItems: 'center',
        padding: '1rem',
        border: '1px solid #e2e8f0',
        borderRadius: '8px',
      }}
    >
      <div
        style={{
          width: 48,
          height: 48,
          borderRadius: '50%',
          background: '#4299e1',
          color: 'white',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          fontWeight: 'bold',
        }}
      >
        {initials}
      </div>
      <div>
        <strong>{user.name}</strong>
        <div style={{ color: '#718096', fontSize: '0.85rem' }}>{user.email}</div>
      </div>
    </div>
  );
}

export function UserProfile() {
  const [selectedId, setSelectedId] = useAtom(selectedUserIdAtom);

  return (
    <section>
      <h2>Selected user</h2>
      <div style={{ marginBottom: '0.75rem', display: 'flex', gap: '0.5rem' }}>
        {[1, 2, 3, 4, 5].map((id) => (
          <button
            key={id}
            onClick={() => setSelectedId(id)}
            style={{
              background: selectedId === id ? '#4299e1' : undefined,
              color: selectedId === id ? 'white' : undefined,
            }}
          >
            #{id}
          </button>
        ))}
      </div>

      {/* Suspense boundary catches the suspending async atom */}
      <Suspense fallback={<p>Loading user...</p>}>
        <UserCard />
      </Suspense>
    </section>
  );
}
