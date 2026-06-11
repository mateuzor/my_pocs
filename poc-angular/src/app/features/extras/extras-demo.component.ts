import { Component } from '@angular/core';
import { HighlightDirective } from './highlight.directive';

@Component({
  selector: 'app-extras-demo',
  imports: [HighlightDirective],
  template: `
    <h2>Custom attribute directive</h2>
    <p appHighlight>default yellow highlight</p>
    <!-- the aliased input drives the host binding -->
    <p [appHighlight]="'lightgreen'">green highlight via input()</p>
  `,
})
export class ExtrasDemoComponent {}
