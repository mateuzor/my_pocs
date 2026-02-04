import DataFetcher from './DataFetcher';

interface User { name: string; email: string; }

function App() {
  return (
    <div style={{ padding: '20px' }}>
      <h1>Render Props: Data Fetcher</h1>
      
      <DataFetcher<User>
        url="https://jsonplaceholder.typicode.com/users/1"
        render={(user, loading, error) => {
          if (loading) return <p>Loading...</p>;
          if (error) return <p style={{ color: 'red' }}>Error: {error}</p>;
          return <div><h3>{user?.name}</h3><p>{user?.email}</p></div>;
        }}
      />
    </div>
  );
}

export default App;
