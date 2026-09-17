// date-fns is built from small pure functions, so bundlers can tree-shake it:
// only `format` and `formatDistanceToNow` end up in the chunk.
import { format, formatDistanceToNow } from 'date-fns';

const sample = new Date(2024, 0, 15);

export default function DateFnsPage() {
  return (
    <section>
      <h2>date-fns (tree-shakeable)</h2>
      <p>Formatted: {format(sample, 'MMMM do yyyy')}</p>
      <p>Relative: {formatDistanceToNow(sample, { addSuffix: true })}</p>
    </section>
  );
}
