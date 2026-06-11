import {
  afterRenderEffect,
  Component,
  computed,
  ElementRef,
  signal,
  viewChild,
  viewChildren,
} from '@angular/core';
import { HeavyWidgetComponent } from './heavy-widget.component';

@Component({
  selector: 'app-templates-demo',
  imports: [HeavyWidgetComponent],
  template: `
    <h2>Signal queries + afterRenderEffect</h2>

    <input #box placeholder="resize me / type here" />
    <p>measured input width: {{ width() }}px</p>

    <div>
      <button #item>a</button>
      <button #item>bb</button>
      <button #item>ccc</button>
    </div>
    <p>buttons found by viewChildren: {{ count() }}</p>

    <h2>Advanced &#64;defer triggers</h2>
    <!-- Load on click, but PREFETCH the chunk as soon as the user hovers the
         placeholder — so by the time they click it's likely already cached.
         @loading has a minimum to avoid a flash; @error covers load failure. -->
    @defer (on interaction; prefetch on hover) {
      <app-heavy-widget />
    } @placeholder {
      <button>click to load widget (hover to prefetch)</button>
    } @loading (minimum 300ms) {
      <p>loading widget…</p>
    } @error {
      <p>failed to load widget</p>
    }

    <h2>&#64;for context vars + &#64;empty, and &#64;switch</h2>
    <button (click)="cycle()">cycle status</button>
    <button (click)="toggleItems()">toggle items</button>

    <ul>
      <!-- $index / $first / $last / $even are built-in context variables. -->
      @for (item of rows(); track item.id; let i = $index, first = $first) {
        <li>{{ i }}: {{ item.label }} @if (first) { <em>(first)</em> }</li>
      } @empty {
        <li>no items</li>
      }
    </ul>

    @switch (status()) {
      @case ('active') { <p>🟢 active</p> }
      @case ('idle') { <p>🟡 idle</p> }
      @default { <p>⚪ unknown</p> }
    }
  `,
})
export class TemplatesDemoComponent {
  // viewChild() — signal-based query, replacing the @ViewChild decorator.
  // Returns a signal that holds the element once the view has rendered.
  readonly box = viewChild<ElementRef<HTMLInputElement>>('box');

  // viewChildren() — the plural form; a signal of all matching elements.
  readonly items = viewChildren<ElementRef<HTMLButtonElement>>('item');
  readonly count = computed(() => this.items().length);

  readonly width = signal(0);

  // Data for the @for / @switch demos below.
  readonly rows = signal([
    { id: 1, label: 'alpha' },
    { id: 2, label: 'beta' },
  ]);
  readonly status = signal<'active' | 'idle' | 'offline'>('active');

  toggleItems() {
    this.rows.update((r) => (r.length ? [] : [{ id: 1, label: 'alpha' }, { id: 2, label: 'beta' }]));
  }

  cycle() {
    const order = ['active', 'idle', 'offline'] as const;
    this.status.update((s) => order[(order.indexOf(s) + 1) % order.length]);
  }

  constructor() {
    // afterRenderEffect — runs AFTER the DOM is painted, so it's the safe place
    // to read layout (offsetWidth/height) without triggering the classic
    // "ExpressionChangedAfterItHasBeenChecked" error.
    afterRenderEffect(() => {
      const el = this.box()?.nativeElement;
      if (el) this.width.set(el.offsetWidth);
    });
  }
}
