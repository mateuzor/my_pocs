import type { Alpine } from 'alpinejs';

// Stores are global reactive objects: the way to share state between
// components that don't have a parent/child relationship.
export function registerStores(Alpine: Alpine) {
  Alpine.store('theme', {
    mode: localStorage.getItem('mode') ?? 'light',
    toggle() {
      this.mode = this.mode === 'light' ? 'dark' : 'light';
      localStorage.setItem('mode', this.mode);
      document.body.classList.toggle('dark', this.mode === 'dark');
    },
  });

  Alpine.store('counter', {
    count: 0,
    inc() {
      this.count++;
    },
  });
}
