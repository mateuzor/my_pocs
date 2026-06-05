import { Component, resource, signal } from '@angular/core';

// Angular 20 — resource(): declarative async backed by signals. The loader runs
// whenever `params` changes and exposes value() / error() / isLoading() AS
// SIGNALS. No manual subscribe, no hand-rolled loading flags, auto-aborts stale
// requests via abortSignal. (For HTTP specifically, v20 also ships httpResource.)
@Component({
  selector: 'app-users',
  template: `
    <button (click)="userId.set(userId() + 1)">load next user</button>
    @if (user.isLoading()) {
      <p>loading…</p>
    } @else if (user.error()) {
      <p>failed to load</p>
    } @else if (user.value(); as u) {
      <p>#{{ u.id }} — {{ u.name }}</p>
    }
  `,
})
export class UsersComponent {
  readonly userId = signal(1);

  readonly user = resource({
    // params is a signal-reading function; a change re-runs the loader.
    params: () => ({ id: this.userId() }),
    loader: async ({ params }) => {
      await new Promise((r) => setTimeout(r, 500));
      return { id: params.id, name: `User ${params.id}` };
    },
  });
}
