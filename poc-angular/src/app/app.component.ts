import { Component, computed, inject, signal } from '@angular/core';
import { RouterLink, RouterOutlet } from '@angular/router';
import { CounterComponent } from './counter.component';
import { UsersComponent } from './users.component';
import { AuthService } from './services/auth.service';

@Component({
  selector: 'app-root',
  imports: [CounterComponent, UsersComponent, RouterLink, RouterOutlet],
  template: `
    <main>
      <h1>{{ title }}</h1>

      <!-- routerLink navigates without a reload; router-outlet renders the
           matched route's lazily-loaded component. -->
      <nav>
        <a routerLink="/">home</a> | <a routerLink="/dashboard">dashboard</a> |
        <a routerLink="/http">http</a>
        <!-- toggle auth to see the guard allow vs redirect the dashboard -->
        @if (auth.isLoggedIn()) {
          <button (click)="auth.logout()">logout</button>
        } @else {
          <button (click)="auth.login()">login</button>
        }
      </nav>
      <router-outlet />

      <!-- Built-in control flow: @if / @for replace *ngIf / *ngFor.
           @let declares a template-local variable. -->
      @let next = count() + 1;
      <p>count: {{ count() }} — next tick would be {{ next }}</p>
      <button (click)="inc()">+1</button>

      @if (count() === 0) {
        <p>nothing yet — click +1</p>
      } @else {
        <ul>
          @for (n of ticks(); track n) {
            <li>tick #{{ n }}</li>
          }
        </ul>
      }

      <h2>Signal inputs / outputs / model()</h2>
      <!-- [(value)] two-way binds a parent SIGNAL straight to the child model. -->
      <app-counter label="apples" [(value)]="apples" [max]="5" (reached)="onReached($event)" />
      <p>apples in parent: {{ apples() }}{{ note() }}</p>

      <h2>Async with resource() + @defer</h2>
      <!-- @defer lazy-loads the widget's chunk only when it scrolls into view. -->
      @defer (on viewport) {
        <app-users />
      } @placeholder {
        <p>scroll down to load the users widget…</p>
      } @loading {
        <p>loading widget…</p>
      }
    </main>
  `,
})
export class AppComponent {
  title = 'Angular 20 POC';
  readonly count = signal(0);
  readonly ticks = computed(() =>
    Array.from({ length: this.count() }, (_, i) => i + 1)
  );

  // Two-way bound to the child's model() — both sides share this one signal.
  readonly apples = signal(2);
  readonly note = signal('');

  // inject() — the function form of DI; pulls the singleton AuthService.
  readonly auth = inject(AuthService);

  inc() {
    this.count.update((n) => n + 1);
  }

  onReached(n: number) {
    this.note.set(` — reached max (${n})!`);
  }
}
