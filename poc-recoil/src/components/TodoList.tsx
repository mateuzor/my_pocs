import { useRecoilState, useRecoilValue, useSetRecoilState } from 'recoil';
import {
  filteredTodosState,
  filterState,
  todoListState,
  todoStatsState,
  type Filter,
} from '../state/todoState';

const FILTERS: Filter[] = ['all', 'active', 'done'];

export function TodoList() {
  // useRecoilValue = read-only subscription to a selector (derived list).
  const todos = useRecoilValue(filteredTodosState);
  const stats = useRecoilValue(todoStatsState);
  // useRecoilState = [value, setter] like useState, but on a shared atom.
  const [filter, setFilter] = useRecoilState(filterState);
  // useSetRecoilState = write-only: this component won't re-render on changes.
  const setTodos = useSetRecoilState(todoListState);

  const toggle = (id: number) =>
    setTodos((prev) => prev.map((t) => (t.id === id ? { ...t, done: !t.done } : t)));

  const add = () =>
    setTodos((prev) => [
      ...prev,
      { id: Date.now(), text: `Task #${prev.length + 1}`, done: false },
    ]);

  return (
    <section>
      <p>
        {stats.remaining} remaining / {stats.total} total
      </p>
      <div>
        {FILTERS.map((f) => (
          <button key={f} onClick={() => setFilter(f)} disabled={f === filter}>
            {f}
          </button>
        ))}
        <button onClick={add}>+ add</button>
      </div>
      <ul>
        {todos.map((t) => (
          <li key={t.id} onClick={() => toggle(t.id)} style={{ cursor: 'pointer' }}>
            {t.done ? '✅' : '⬜'} {t.text}
          </li>
        ))}
      </ul>
    </section>
  );
}
