import {
  afterRenderEffect,
  Component,
  computed,
  ElementRef,
  signal,
  viewChild,
  viewChildren,
} from '@angular/core';

@Component({
  selector: 'app-templates-demo',
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
