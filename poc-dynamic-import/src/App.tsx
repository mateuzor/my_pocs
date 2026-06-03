import { ManualImport } from './ManualImport';

export function App() {
  return (
    <main style={{ fontFamily: 'system-ui', maxWidth: 640, margin: '2rem auto' }}>
      <h1>Dynamic import comparison</h1>
      <p>Three ways to split code — open the Network tab and watch the chunks.</p>
      <ManualImport />
    </main>
  );
}
