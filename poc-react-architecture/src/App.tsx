import { useState, FormEvent } from 'react';

function App() {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    alert(JSON.stringify({ name, email }));
  };

  return (
    <div style={{ padding: '20px' }}>
      <h1>Controlled Components</h1>
      <p>React state manages value</p>
      
      <form onSubmit={handleSubmit}>
        <div style={{ marginBottom: '10px' }}>
          <label>Name:</label>
          <input value={name} onChange={e => setName(e.target.value)} style={{ marginLeft: '10px', padding: '5px' }} />
          <p style={{ fontSize: '12px', color: '#666' }}>Current: {name || '(empty)'}</p>
        </div>
        <div style={{ marginBottom: '10px' }}>
          <label>Email:</label>
          <input value={email} onChange={e => setEmail(e.target.value)} style={{ marginLeft: '10px', padding: '5px' }} />
        </div>
        <button type="submit" style={{ padding: '8px 16px' }}>Submit</button>
      </form>
    </div>
  );
}

export default App;
