import { Component, inject } from '@angular/core';
import { HighlightDirective } from './highlight.directive';
import { TruncatePipe } from './truncate.pipe';
import { CardComponent } from './card.component';
import { APP_CONFIG } from './app-config.token';

@Component({
  selector: 'app-extras-demo',
  imports: [HighlightDirective, TruncatePipe, CardComponent],
  template: `
    <h2>Custom attribute directive</h2>
    <p appHighlight>default yellow highlight</p>
    <!-- the aliased input drives the host binding -->
    <p [appHighlight]="'lightgreen'">green highlight via input()</p>

    <h2>Custom pipe</h2>
    <p>{{ longText | truncate: 25 }}</p>

    <h2>Content projection</h2>
    <app-card>
      <span card-title>Projected title</span>
      <!-- this goes to the default <ng-content> slot -->
      <p>Body content projected into the card.</p>
    </app-card>

    <h2>InjectionToken</h2>
    <!-- value comes from the provider override in main.ts, not the default -->
    <p>apiUrl: {{ config.apiUrl }} — featureX: {{ config.featureX }}</p>
  `,
})
export class ExtrasDemoComponent {
  readonly longText = 'This sentence is long enough to be truncated by the pipe.';
  // inject() works with a token just like with a class.
  readonly config = inject(APP_CONFIG);
}
