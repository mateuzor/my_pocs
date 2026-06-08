import { Component, inject, signal } from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';
import { httpResource } from '@angular/common/http';
import { ApiUser, UsersHttpService } from './users-http.service';

@Component({
  selector: 'app-http-demo',
  template: `
    <h2>HttpClient + toSignal</h2>
    <button (click)="id.set(id() + 1)">load next (#{{ id() }})</button>
    <!-- toSignal subscribes the Observable and exposes its latest value as a
         signal — auto-unsubscribes when the component is destroyed. -->
    @if (firstUser(); as u) {
      <p>#{{ u.id }} — {{ u.name }} ({{ u.email }})</p>
    } @else {
      <p>loading…</p>
    }

    <h2>httpResource (Angular 20)</h2>
    <!-- httpResource reacts to id() and gives status as signals out of the box.
         No service, no subscribe, no manual loading flag — and stale requests
         are auto-aborted when id() changes. -->
    @if (user.isLoading()) {
      <p>loading…</p>
    } @else if (user.error()) {
      <p>request failed</p>
    } @else if (user.value(); as u) {
      <p>#{{ u.id }} — {{ u.name }} ({{ u.email }})</p>
    }
  `,
})
export class HttpDemoComponent {
  private readonly api = inject(UsersHttpService);
  readonly id = signal(1);
  private readonly base = 'https://jsonplaceholder.typicode.com';

  // Imperative/RxJS style: one-shot fetch bridged to a signal.
  readonly firstUser = toSignal(this.api.getUser(1));

  // Declarative style: the URL is a function of id(); changing id() re-fetches.
  readonly user = httpResource<ApiUser>(() => `${this.base}/users/${this.id()}`);
}
