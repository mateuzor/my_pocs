import Alpine from 'alpinejs';
import './style.css';
import { registerStores } from './stores';

interface Todo { id: number; text: string; done: boolean }

// Alpine.data registers a reusable component. Keeping logic here (instead of
// inline in HTML) makes it testable and typed.
Alpine.data('todos', () => ({
  newTodo: '',
  todos: [
    { id: 1, text: 'Learn x-data', done: true },
    { id: 2, text: 'Learn x-for', done: false },
  ] as Todo[],
  // Getters are reactive: Alpine tracks the properties they read.
  get remaining() {
    return this.todos.filter((t) => !t.done).length;
  },
  add() {
    if (!this.newTodo.trim()) return;
    this.todos.push({ id: Date.now(), text: this.newTodo, done: false });
    this.newTodo = '';
  },
  remove(id: number) {
    this.todos = this.todos.filter((t) => t.id !== id);
  },
}));

registerStores(Alpine);
document.body.classList.toggle('dark', localStorage.getItem('mode') === 'dark');

// Alpine.start() must run after data/stores are registered, it scans the DOM.
(window as unknown as { Alpine: typeof Alpine }).Alpine = Alpine;
Alpine.start();
