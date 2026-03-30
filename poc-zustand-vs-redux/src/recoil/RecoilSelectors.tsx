import { useRecoilValue } from 'recoil';
import { greetingSelector, doubledCountSelector, multipliedCountSelector } from './selectors';

export function RecoilSelectors() {
  // useRecoilValue works the same for selectors and atoms
  const greeting = useRecoilValue(greetingSelector);
  const doubled = useRecoilValue(doubledCountSelector);

  // selectorFamily: pass the parameter directly in the hook call
  const tripled = useRecoilValue(multipliedCountSelector(3));
  const tenX = useRecoilValue(multipliedCountSelector(10));

  return (
    <div style={{ padding: '1.5rem', border: '1px solid #ddd', borderRadius: '8px', marginBottom: '1rem' }}>
      <h3>Recoil — selectors</h3>
      <p style={{ color: '#555', fontSize: '0.9rem' }}>
        Selectors derive state from atoms. They are memoized and update automatically.
        Change the count or name above to see these update.
      </p>

      <ul style={{ listStyle: 'none', padding: 0, marginTop: '0.75rem' }}>
        <li style={{ padding: '0.4rem 0', borderBottom: '1px solid #eee' }}>
          <strong>greeting:</strong> {greeting}
        </li>
        <li style={{ padding: '0.4rem 0', borderBottom: '1px solid #eee' }}>
          <strong>doubled:</strong> {doubled}
        </li>
        <li style={{ padding: '0.4rem 0', borderBottom: '1px solid #eee' }}>
          <strong>tripled (selectorFamily × 3):</strong> {tripled}
        </li>
        <li style={{ padding: '0.4rem 0' }}>
          <strong>10× (selectorFamily × 10):</strong> {tenX}
        </li>
      </ul>
    </div>
  );
}
