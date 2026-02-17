import { useState } from 'react';
import { useFetch } from '../hooks/useFetch';

interface Post {
  id: number;
  title: string;
  body: string;
  userId: number;
}

interface User {
  id: number;
  name: string;
  email: string;
}

// Example 1: Auto fetch on mount
function AutoFetchExample() {
  const { data, isLoading, error, execute } = useFetch<Post[]>(
    'https://jsonplaceholder.typicode.com/posts?_limit=5'
  );

  return (
    <div style={{ padding: '20px', backgroundColor: '#e3f2fd', borderRadius: '8px', marginBottom: '20px' }}>
      <h2>Auto fetch on mount</h2>
      <button
        onClick={() => execute()}
        disabled={isLoading}
        style={{ padding: '8px 16px', marginBottom: '15px', cursor: 'pointer' }}
      >
        {isLoading ? 'Refreshing...' : 'Refresh'}
      </button>
      {error && <p style={{ color: 'red' }}>Error: {error}</p>}
      {data?.map(post => (
        <div key={post.id} style={{ padding: '8px', borderBottom: '1px solid #ccc', fontSize: '14px' }}>
          <strong>#{post.id}</strong> {post.title}
        </div>
      ))}
    </div>
  );
}

// Example 2: Manual trigger
function ManualFetchExample() {
  const [userId, setUserId] = useState(1);
  const { data, isLoading, error, execute, reset } = useFetch<User>(
    `https://jsonplaceholder.typicode.com/users/${userId}`,
    { immediate: false }
  );

  return (
    <div style={{ padding: '20px', backgroundColor: '#e8f5e9', borderRadius: '8px', marginBottom: '20px' }}>
      <h2>Manual trigger</h2>
      <div style={{ display: 'flex', gap: '10px', marginBottom: '15px', alignItems: 'center' }}>
        <label>User ID:</label>
        <input
          type="number"
          value={userId}
          min={1}
          max={10}
          onChange={e => setUserId(Number(e.target.value))}
          style={{ padding: '8px', width: '70px' }}
        />
        <button
          onClick={() => execute()}
          disabled={isLoading}
          style={{ padding: '8px 16px', cursor: 'pointer', backgroundColor: '#388e3c', color: 'white', border: 'none', borderRadius: '4px' }}
        >
          {isLoading ? 'Loading...' : 'Fetch User'}
        </button>
        <button
          onClick={reset}
          style={{ padding: '8px 16px', cursor: 'pointer' }}
        >
          Reset
        </button>
      </div>
      {error && <p style={{ color: 'red' }}>Error: {error}</p>}
      {data && (
        <div style={{ padding: '12px', backgroundColor: 'white', borderRadius: '4px' }}>
          <p><strong>Name:</strong> {data.name}</p>
          <p><strong>Email:</strong> {data.email}</p>
        </div>
      )}
    </div>
  );
}

// Example 3: With timeout
function TimeoutFetchExample() {
  const { data, isLoading, error, execute } = useFetch<Post>(
    'https://jsonplaceholder.typicode.com/posts/1',
    { immediate: false, timeoutMs: 100 } // 100ms timeout — will fail!
  );

  return (
    <div style={{ padding: '20px', backgroundColor: '#fce4ec', borderRadius: '8px' }}>
      <h2>With timeout (100ms — will timeout)</h2>
      <button
        onClick={() => execute()}
        disabled={isLoading}
        style={{ padding: '8px 16px', marginBottom: '15px', cursor: 'pointer', backgroundColor: '#c62828', color: 'white', border: 'none', borderRadius: '4px' }}
      >
        {isLoading ? 'Loading...' : 'Fetch (100ms timeout)'}
      </button>
      {error && <p style={{ color: 'red' }}>❌ {error}</p>}
      {data && <p style={{ color: 'green' }}>✅ {data.title}</p>}
    </div>
  );
}

export default function UseFetchDemo() {
  return (
    <div style={{ padding: '40px', maxWidth: '800px', margin: '0 auto' }}>
      <h1>Custom useFetch Hook</h1>
      <p style={{ color: '#666', marginBottom: '30px' }}>
        A reusable hook that encapsulates fetch logic: loading state, error handling, abort, timeout, and manual/auto execution.
      </p>

      <AutoFetchExample />
      <ManualFetchExample />
      <TimeoutFetchExample />

      <div style={{ padding: '15px', backgroundColor: '#f5f5f5', borderRadius: '4px', marginTop: '20px' }}>
        <h3>useFetch hook features:</h3>
        <ul>
          <li><strong>immediate</strong> — auto-fetch on mount (default: true)</li>
          <li><strong>execute()</strong> — manually trigger or re-fetch</li>
          <li><strong>reset()</strong> — clear state back to idle</li>
          <li><strong>timeoutMs</strong> — optional request timeout</li>
          <li><strong>AbortController</strong> — cancels previous request on re-execute</li>
          <li><strong>Cleanup</strong> — aborts on unmount to prevent state updates on dead components</li>
        </ul>
      </div>
    </div>
  );
}
