import { Component, computed, signal } from '@angular/core';
import { CounterComponent } from './counter.component';

@Component({
  selector: 'app-root',
  imports: [CounterComponent],
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

      <h2>Signal inputs / outputs / model()</h2>
      <!-- [(value)] two-way binds a parent SIGNAL straight to the child model. -->
      <app-counter label="apples" [(value)]="apples" [max]="5" (reached)="onReached($event)" />
      <p>apples in parent: {{ apples() }}{{ note() }}</p>
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

  inc() {
    this.count.update((n) => n + 1);
  }

  onReached(n: number) {
    this.note.set(` — reached max (${n})!`);
  }
}
