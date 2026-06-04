import { Component, computed, signal } from '@angular/core';

// Angular 20 — `standalone: true` is now the DEFAULT, so it's gone. A component
// just declares what it `imports`. Change detection here is driven by signals
// (the app runs zoneless — see main.ts).
@Component({
  selector: 'app-root',
  template: `
    <main>
      <h1>{{ title }}</h1>

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
    </main>
  `,
})
export class AppComponent {
  title = 'Angular 20 POC';
  // signal() = reactive state. Reading count() in the template subscribes the
  // view; writing it is what schedules a re-render in zoneless mode.
  readonly count = signal(0);
  // computed() = memoized derived signal, recomputed only when count() changes.
  readonly ticks = computed(() =>
    Array.from({ length: this.count() }, (_, i) => i + 1)
  );

  inc() {
    this.count.update((n) => n + 1);
  }
}
