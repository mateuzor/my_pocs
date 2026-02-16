import { useState } from 'react';

type Scenario = 'ok' | '404' | '500' | 'network' | 'invalid-json';

interface Result {
  scenario: Scenario;
  success: boolean;
  message: string;
  detail?: string;
}

// Custom error class for HTTP errors
class HttpError extends Error {
  constructor(public status: number, message: string) {
    super(message);
    this.name = 'HttpError';
  }
}

// Safe fetch that throws on non-2xx responses
async function safeFetch(url: string, options?: RequestInit): Promise<Response> {
  const res = await fetch(url, options);
  if (!res.ok) {
    throw new HttpError(res.status, `HTTP ${res.status}: ${res.statusText}`);
  }
  return res;
}

export default function FetchErrorHandlingDemo() {
  const [result, setResult] = useState<Result | null>(null);
  const [loading, setLoading] = useState<Scenario | null>(null);

  const run = async (scenario: Scenario) => {
    setLoading(scenario);
    setResult(null);

    try {
      switch (scenario) {
        case 'ok': {
          const res = await safeFetch('https://jsonplaceholder.typicode.com/posts/1');
          const data = await res.json();
          setResult({ scenario, success: true, message: 'Request succeeded!', detail: `Post: "${data.title}"` });
          break;
        }

        case '404': {
          // Non-existent resource
          await safeFetch('https://jsonplaceholder.typicode.com/posts/99999');
          break;
        }

        case '500': {
          // Simulate 500 via httpstat.us
          await safeFetch('https://httpstat.us/500');
          break;
        }

        case 'network': {
          // Invalid domain = network error
          await safeFetch('https://this-domain-does-not-exist-xyz.com/api');
          break;
        }

        case 'invalid-json': {
          // Fetch succeeds but JSON parse fails
          const res = await fetch('https://jsonplaceholder.typicode.com/posts/1');
          await (res as any).notJson(); // Forces a parse error
          break;
        }
      }
    } catch (err) {
      if (err instanceof HttpError) {
        setResult({
          scenario,
          success: false,
          message: `HttpError: ${err.message}`,
          detail: `Status code: ${err.status}. Handle this with specific UI feedback (404 = not found, 401 = redirect to login, 500 = retry later).`,
        });
      } else if (err instanceof TypeError) {
        setResult({
          scenario,
          success: false,
          message: `Network Error: ${err.message}`,
          detail: 'Network errors = no internet, DNS fail, CORS block. fetch() itself throws TypeError for these.',
        });
      } else {
        setResult({
          scenario,
          success: false,
          message: `Unknown error: ${String(err)}`,
          detail: 'Catch-all for unexpected errors.',
        });
      }
    } finally {
      setLoading(null);
    }
  };

  const scenarios: { id: Scenario; label: string; color: string }[] = [
    { id: 'ok', label: '200 OK', color: '#4CAF50' },
    { id: '404', label: '404 Not Found', color: '#FF9800' },
    { id: '500', label: '500 Server Error', color: '#f44336' },
    { id: 'network', label: 'Network Error', color: '#9C27B0' },
    { id: 'invalid-json', label: 'Parse Error', color: '#795548' },
  ];

  return (
    <div style={{ padding: '40px', maxWidth: '800px', margin: '0 auto' }}>
      <h1>Fetch API - Error Handling</h1>

      <div style={{ marginBottom: '30px', padding: '15px', backgroundColor: '#fff3cd', borderRadius: '4px' }}>
        <strong>Key insight:</strong> fetch() only rejects on network errors.
        A 404 or 500 response is considered "successful" by fetch — you must check <code>res.ok</code> manually!
      </div>

      <div style={{ display: 'flex', gap: '10px', flexWrap: 'wrap', marginBottom: '30px' }}>
        {scenarios.map(s => (
          <button
            key={s.id}
            onClick={() => run(s.id)}
            disabled={loading !== null}
            style={{
              padding: '10px 16px',
              cursor: loading ? 'wait' : 'pointer',
              backgroundColor: loading === s.id ? '#ccc' : s.color,
              color: 'white',
              border: 'none',
              borderRadius: '4px',
              opacity: loading && loading !== s.id ? 0.6 : 1,
            }}
          >
            {loading === s.id ? 'Running...' : `Try: ${s.label}`}
          </button>
        ))}
      </div>

      {result && (
        <div style={{
          padding: '20px',
          borderRadius: '8px',
          backgroundColor: result.success ? '#e8f5e9' : '#ffebee',
          borderLeft: `4px solid ${result.success ? '#4CAF50' : '#f44336'}`,
        }}>
          <p style={{ fontWeight: 'bold', marginBottom: '8px' }}>
            {result.success ? '✅' : '❌'} {result.message}
          </p>
          {result.detail && <p style={{ margin: 0, color: '#555', fontSize: '14px' }}>{result.detail}</p>}
        </div>
      )}

      <div style={{ marginTop: '30px', padding: '15px', backgroundColor: '#f5f5f5', borderRadius: '4px' }}>
        <h3>Error handling patterns:</h3>
        <ul>
          <li><strong>res.ok</strong> — false when status is 4xx or 5xx, throw manually</li>
          <li><strong>HttpError class</strong> — custom error with status code for typed catches</li>
          <li><strong>TypeError</strong> — what fetch throws for network/CORS failures</li>
          <li><strong>try/catch/finally</strong> — always use finally to reset loading state</li>
          <li><strong>instanceof</strong> — distinguish error types for different UI responses</li>
        </ul>
      </div>
    </div>
  );
}
