import { Component, inject, signal } from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';
import { UsersHttpService } from './users-http.service';

// Bridges the RxJS world (HttpClient returns Observables) into signals.
@Component({
  selector: 'app-http-demo',
  template: `
    <h2>HttpClient + toSignal</h2>
    <button (click)="id.set(id() + 1)">load next (#{{ id() }})</button>
    <!-- toSignal subscribes the Observable and exposes its latest value as a
         signal — auto-unsubscribes when the component is destroyed. -->
    @if (user(); as u) {
      <p>#{{ u.id }} — {{ u.name }} ({{ u.email }})</p>
    } @else {
      <p>loading…</p>
    }
  `,
})
export class HttpDemoComponent {
  private readonly api = inject(UsersHttpService);
  readonly id = signal(1);

  // switchMap-like behaviour: re-fetch isn't wired yet here; this commit shows
  // the toSignal bridge for the first load. (httpResource lands next commit.)
  readonly user = toSignal(this.api.getUser(this.id()));
}
