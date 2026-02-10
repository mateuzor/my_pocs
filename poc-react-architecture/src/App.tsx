import { useRef, FormEvent } from 'react';

function App() {
  const nameRef = useRef<HTMLInputElement>(null);
  const emailRef = useRef<HTMLInputElement>(null);

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    alert(JSON.stringify({ name: nameRef.current?.value, email: emailRef.current?.value }));
  };

  return (
    <div style={{ padding: '20px' }}>
      <h1>Uncontrolled Components</h1>
      <p>Using refs, DOM manages state</p>
      
      <form onSubmit={handleSubmit}>
        <div style={{ marginBottom: '10px' }}>
          <label>Name:</label>
          <input ref={nameRef} type="text" style={{ marginLeft: '10px', padding: '5px' }} />
        </div>
        <div style={{ marginBottom: '10px' }}>
          <label>Email:</label>
          <input ref={emailRef} type="email" style={{ marginLeft: '10px', padding: '5px' }} />
        </div>
        <button type="submit" style={{ padding: '8px 16px' }}>Submit</button>
      </form>
    </div>
  );
}

export default App;
