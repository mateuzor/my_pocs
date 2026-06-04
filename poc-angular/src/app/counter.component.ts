import { Component, computed, effect, input, linkedSignal, model, output } from '@angular/core';

// Angular 20 — signal-based component I/O. No @Input()/@Output() decorators:
// inputs/outputs are functions that return signals.
@Component({
  selector: 'app-counter',
  template: `
    <fieldset>
      <legend>{{ label() }}</legend>
      <button (click)="value.set(value() - step())">−</button>
      <strong>{{ value() }}</strong>
      <button (click)="value.set(value() + step())">+</button>
      <p>doubled (computed): {{ doubled() }}</p>
      <p>clamped 0..{{ max() }} (linkedSignal): {{ clamped() }}</p>
    </fieldset>
  `,
})
export class CounterComponent {
  // input() — replaces @Input(). Returns a read-only signal with a default.
  readonly label = input('counter');
  readonly step = input(1);
  readonly max = input(10);

  // model() — a two-way bindable signal. The parent can do [(value)]="signal";
  // it also auto-creates a `valueChange` output behind the scenes.
  readonly value = model(0);

  // output() — replaces @Output() EventEmitter; emit() pushes to the parent.
  readonly reached = output<number>();

  // computed() — memoized derived signal.
  readonly doubled = computed(() => this.value() * 2);

  // linkedSignal() — writable state DERIVED from a source that re-syncs when the
  // source changes (new in v19/20). Here it mirrors value(), clamped to [0,max].
  readonly clamped = linkedSignal(() =>
    Math.min(Math.max(this.value(), 0), this.max())
  );

  constructor() {
    // effect() — runs whenever the signals it reads change. Side-effect land:
    // notify the parent the moment value() hits the max.
    effect(() => {
      if (this.value() >= this.max()) this.reached.emit(this.value());
    });
  }
}
