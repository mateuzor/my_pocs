import { atom, selector } from 'recoil';

export interface Todo {
  id: number;
  text: string;
  done: boolean;
}

export type Filter = 'all' | 'active' | 'done';

// An ATOM is a single unit of writable state. Any component can read/write it
// with useRecoilState, and only the readers of THIS atom re-render on change.
export const todoListState = atom<Todo[]>({
  key: 'todoListState', // keys must be globally unique across the app
  default: [
    { id: 1, text: 'Learn Recoil atoms', done: true },
    { id: 2, text: 'Understand selectors', done: false },
  ],
});

export const filterState = atom<Filter>({
  key: 'filterState',
  default: 'all',
});

// A SELECTOR is DERIVED state: a pure function of other atoms/selectors.
// Recoil memoizes it and only recomputes when a dependency it actually read
// changes. Here the derived list depends on BOTH the todos and the filter.
export const filteredTodosState = selector<Todo[]>({
  key: 'filteredTodosState',
  get: ({ get }) => {
    const todos = get(todoListState);
    const filter = get(filterState);
    if (filter === 'active') return todos.filter((t) => !t.done);
    if (filter === 'done') return todos.filter((t) => t.done);
    return todos;
  },
});

// Selectors compose freely — this one derives stats from the same atom.
// Components that only show the counter won't re-render when the filter changes.
export const todoStatsState = selector({
  key: 'todoStatsState',
  get: ({ get }) => {
    const todos = get(todoListState);
    const done = todos.filter((t) => t.done).length;
    return { total: todos.length, done, remaining: todos.length - done };
  },
});
