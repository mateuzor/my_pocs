import useSWR, { SWRConfig } from 'swr';

interface User {
  id: number;
  name: string;
  email: string;
}

const fetcher = (url: string) => fetch(url).then(r => r.json());

// Inner component — uses useSWR without specifying a fetcher
// The fetcher is inherited from the nearest SWRConfig provider
function UserCard({ userId }: { userId: number }) {
  const { data, isLoading } = useSWR<User>(
    `https://jsonplaceholder.typicode.com/users/${userId}`,
  );

  if (isLoading) return <p>Loading user {userId}...</p>;

  return (
    <div style={{ padding: '0.75rem', background: '#f9f9f9', borderRadius: '6px', marginBottom: '0.5rem' }}>
      <strong>{data?.name}</strong> — {data?.email}
    </div>
  );
}

export function SWRConfigDemo() {
  return (
    // SWRConfig sets global defaults for all useSWR calls in its subtree
    <SWRConfig
      value={{
        fetcher,                     // shared fetcher — no need to pass it per-hook
        revalidateOnFocus: true,     // refetch when user returns to the tab
        revalidateOnReconnect: true, // refetch when network reconnects
        dedupingInterval: 2000,      // deduplicate requests within 2 seconds
        errorRetryCount: 3,          // retry failed requests up to 3 times
      }}
    >
      <div style={{ padding: '1.5rem', border: '1px solid #ddd', borderRadius: '8px', marginBottom: '1rem' }}>
        <h3>SWR — Global Config + Revalidation</h3>
        <p style={{ color: '#555', fontSize: '0.9rem' }}>
          Switch tabs and come back — SWR revalidates automatically on focus.
        </p>
        <UserCard userId={1} />
        <UserCard userId={2} />
        <UserCard userId={3} />
      </div>
    </SWRConfig>
  );
}
