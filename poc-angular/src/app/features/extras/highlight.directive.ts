import { Directive, input } from '@angular/core';

// A custom ATTRIBUTE directive. The selector `[appHighlight]` matches any
// element carrying that attribute. Directives use the same signal input() API
// as components, and `host` bindings react to those signals automatically.
@Directive({
  selector: '[appHighlight]',
  host: {
    // bind the element's background to the color() signal — updates reactively
    '[style.backgroundColor]': 'color()',
    '[style.padding]': '"2px 4px"',
  },
})
export class HighlightDirective {
  // Aliased so the usage reads `[appHighlight]="'lightgreen'"`; defaults to yellow.
  readonly color = input('yellow', { alias: 'appHighlight' });
}
