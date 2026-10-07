import type { Row } from './data';

// Baseline: on every parent render React re-creates the vDOM for each row
// and diffs it against the previous one, even when only `score` changed.
export function PlainRow({ row }: { row: Row }) {
  return (
    <tr>
      <td>{row.id}</td>
      <td>{row.name}</td>
      <td>{row.email}</td>
      <td>{row.score}</td>
    </tr>
  );
}
