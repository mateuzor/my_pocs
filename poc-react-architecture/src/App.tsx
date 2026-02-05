import { useFetch, useLocalStorage } from './hooks';

function App() {
  const { data, loading } = useFetch<{ title: string }>('https://jsonplaceholder.typicode.com/todos/1');
  const [name, setName] = useLocalStorage('name', '');

  return (
    <div style={{ padding: '20px' }}>
      <h1>Custom Hooks: useFetch & useLocalStorage</h1>
      
      <div style={{ marginBottom: '20px' }}>
        <h2>useFetch Demo</h2>
        {loading ? <p>Loading...</p> : <p>Todo: {data?.title}</p>}
      </div>

      <div>
        <h2>useLocalStorage Demo</h2>
        <input value={name} onChange={e => setName(e.target.value)} placeholder="Your name" style={{ padding: '8px' }} />
        <p>Stored: {name}</p>
      </div>
    </div>
  );
}

export default App;
