import { create } from 'zustand';
import { persist } from 'zustand/middleware';

interface Todo {
  id: number;
  text: string;
  done: boolean;
}

interface TodoStore {
  todos: Todo[];
  addTodo: (text: string) => void;
  toggleTodo: (id: number) => void;
  removeTodo: (id: number) => void;
  clearDone: () => void;
}

// persist middleware automatically saves and rehydrates the store from localStorage
// The key 'todo-store' is the localStorage key
export const useTodoStore = create<TodoStore>()(
  persist(
    (set) => ({
      todos: [],

      addTodo: (text) =>
        set((state) => ({
          // In Zustand, set merges the returned object with the current state
          todos: [...state.todos, { id: Date.now(), text, done: false }],
        })),

      toggleTodo: (id) =>
        set((state) => ({
          todos: state.todos.map((t) =>
            t.id === id ? { ...t, done: !t.done } : t
          ),
        })),

      removeTodo: (id) =>
        set((state) => ({
          todos: state.todos.filter((t) => t.id !== id),
        })),

      clearDone: () =>
        set((state) => ({
          todos: state.todos.filter((t) => !t.done),
        })),
    }),
    { name: 'todo-store' } // localStorage key
  )
);
