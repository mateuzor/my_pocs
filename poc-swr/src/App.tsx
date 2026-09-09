import { Todos, RefreshButton } from './components/Todos';
import { Dedupe } from './components/Dedupe';
import { Posts } from './components/Posts';

export function App() {
  return (
    <main style={{ fontFamily: 'system-ui', maxWidth: 640, margin: '2rem auto' }}>
      <h1>SWR POC</h1>
      <Todos />
      <RefreshButton />
      <Dedupe />
      <Posts />
    </main>
  );
}
