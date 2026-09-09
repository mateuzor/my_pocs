import { useTodos, useClock } from '../hooks';
import { fetchCount } from '../api';

function Counter({ n }: { n: number }) {
  const { data } = useTodos();
  return <span>Consumer {n}: {data ? data.length : '...'} todos. </span>;
}

// Five components use the same key: the network sees a single request.
export function Dedupe() {
  const { data: time } = useClock();
  const { isValidating } = useTodos();
  return (
    <section>
      <h2>Dedupe + polling</h2>
      {[1, 2, 3, 4, 5].map((n) => <Counter key={n} n={n} />)}
      <p>Todo fetches so far: {fetchCount} {isValidating && '(fetching)'}</p>
      <p>Polled clock: {time}</p>
      <p><small>Switch tabs and come back: revalidateOnFocus refetches.</small></p>
    </section>
  );
}
