import { TodoList } from './components/TodoList';

export function App() {
  return (
    <main style={{ fontFamily: 'system-ui', maxWidth: 640, margin: '2rem auto' }}>
      <h1>Recoil POC</h1>
      <p>Atoms (writable units) + selectors (memoized derived state).</p>
      <TodoList />
    </main>
  );
}
