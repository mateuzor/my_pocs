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
