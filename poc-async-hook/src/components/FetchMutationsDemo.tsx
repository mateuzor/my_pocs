import { useState } from 'react';

interface Post {
  id?: number;
  title: string;
  body: string;
  userId: number;
}

type Method = 'POST' | 'PUT' | 'DELETE';

interface RequestLog {
  method: Method;
  url: string;
  status: number;
  response: unknown;
}

export default function FetchMutationsDemo() {
  const [title, setTitle] = useState('My new post');
  const [body, setBody] = useState('Post content here...');
  const [loading, setLoading] = useState<Method | null>(null);
  const [log, setLog] = useState<RequestLog[]>([]);

  const addLog = (entry: RequestLog) => {
    setLog(prev => [entry, ...prev].slice(0, 5));
  };

  // POST - create new resource
  const handlePost = async () => {
    setLoading('POST');
    const res = await fetch('https://jsonplaceholder.typicode.com/posts', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ title, body, userId: 1 }),
    });
    const data = await res.json();
    addLog({ method: 'POST', url: '/posts', status: res.status, response: data });
    setLoading(null);
  };

  // PUT - replace entire resource
  const handlePut = async () => {
    setLoading('PUT');
    const res = await fetch('https://jsonplaceholder.typicode.com/posts/1', {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ id: 1, title, body, userId: 1 }),
    });
    const data = await res.json();
    addLog({ method: 'PUT', url: '/posts/1', status: res.status, response: data });
    setLoading(null);
  };

  // DELETE - remove resource
  const handleDelete = async () => {
    setLoading('DELETE');
    const res = await fetch('https://jsonplaceholder.typicode.com/posts/1', {
      method: 'DELETE',
    });
    addLog({ method: 'DELETE', url: '/posts/1', status: res.status, response: '(empty body)' });
    setLoading(null);
  };

  const methodColor = (method: Method) => {
    const colors: Record<Method, string> = { POST: '#4CAF50', PUT: '#FF9800', DELETE: '#f44336' };
    return colors[method];
  };

  return (
    <div style={{ padding: '40px', maxWidth: '800px', margin: '0 auto' }}>
      <h1>Fetch API - POST, PUT, DELETE</h1>

      {/* Form inputs */}
      <div style={{ marginBottom: '30px', padding: '20px', backgroundColor: '#f5f5f5', borderRadius: '8px' }}>
        <div style={{ marginBottom: '15px' }}>
          <label style={{ display: 'block', marginBottom: '5px' }}>Title:</label>
          <input
            value={title}
            onChange={e => setTitle(e.target.value)}
            style={{ padding: '10px', width: '100%', boxSizing: 'border-box' }}
          />
        </div>
        <div style={{ marginBottom: '15px' }}>
          <label style={{ display: 'block', marginBottom: '5px' }}>Body:</label>
          <textarea
            value={body}
            onChange={e => setBody(e.target.value)}
            rows={3}
            style={{ padding: '10px', width: '100%', boxSizing: 'border-box' }}
          />
        </div>

        <div style={{ display: 'flex', gap: '10px' }}>
          <button
            onClick={handlePost}
            disabled={loading !== null}
            style={{ padding: '10px 20px', cursor: 'pointer', backgroundColor: '#4CAF50', color: 'white', border: 'none', borderRadius: '4px', flex: 1 }}
          >
            {loading === 'POST' ? 'Posting...' : 'POST /posts'}
          </button>
          <button
            onClick={handlePut}
            disabled={loading !== null}
            style={{ padding: '10px 20px', cursor: 'pointer', backgroundColor: '#FF9800', color: 'white', border: 'none', borderRadius: '4px', flex: 1 }}
          >
            {loading === 'PUT' ? 'Updating...' : 'PUT /posts/1'}
          </button>
          <button
            onClick={handleDelete}
            disabled={loading !== null}
            style={{ padding: '10px 20px', cursor: 'pointer', backgroundColor: '#f44336', color: 'white', border: 'none', borderRadius: '4px', flex: 1 }}
          >
            {loading === 'DELETE' ? 'Deleting...' : 'DELETE /posts/1'}
          </button>
        </div>
      </div>

      {/* Request log */}
      {log.length > 0 && (
        <div style={{ marginBottom: '30px' }}>
          <h2>Request Log</h2>
          {log.map((entry, i) => (
            <div key={i} style={{ marginBottom: '10px', padding: '15px', backgroundColor: '#fafafa', borderRadius: '4px', borderLeft: `4px solid ${methodColor(entry.method)}` }}>
              <div style={{ display: 'flex', gap: '10px', marginBottom: '8px', alignItems: 'center' }}>
                <span style={{ fontWeight: 'bold', color: methodColor(entry.method) }}>{entry.method}</span>
                <span style={{ color: '#666' }}>{entry.url}</span>
                <span style={{ marginLeft: 'auto', backgroundColor: entry.status < 300 ? '#e8f5e9' : '#ffebee', padding: '2px 8px', borderRadius: '12px', fontSize: '13px' }}>
                  {entry.status}
                </span>
              </div>
              <pre style={{ margin: 0, fontSize: '12px', color: '#555', overflow: 'auto' }}>
                {JSON.stringify(entry.response, null, 2)}
              </pre>
            </div>
          ))}
        </div>
      )}

      <div style={{ padding: '15px', backgroundColor: '#f5f5f5', borderRadius: '4px' }}>
        <h3>Mutation patterns:</h3>
        <ul>
          <li><strong>POST</strong> - create resource, sends body, returns created item (201)</li>
          <li><strong>PUT</strong> - replace full resource, sends complete object (200)</li>
          <li><strong>PATCH</strong> - partial update, sends only changed fields (200)</li>
          <li><strong>DELETE</strong> - remove resource, usually returns empty body (200/204)</li>
          <li>Always set <code>Content-Type: application/json</code> when sending JSON body</li>
        </ul>
      </div>
    </div>
  );
}
