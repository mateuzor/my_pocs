import { block } from 'million/react';
import type { Row } from './data';

// block() skips the vDOM: the static <tr>/<td> structure is cloned once and
// only the four dynamic holes ({row.*}) are patched directly in the DOM.
// Rule: the component must be pure and use simple JSX (no conditional
// hooks / arbitrary control flow inside), otherwise the compiler bails out.
export const BlockRow = block(function BlockRow({ row }: { row: Row }) {
  return (
    <tr>
      <td>{row.id}</td>
      <td>{row.name}</td>
      <td>{row.email}</td>
      <td>{row.score}</td>
    </tr>
  );
});
