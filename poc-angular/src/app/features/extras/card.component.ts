import { Component } from '@angular/core';

// CONTENT PROJECTION: <ng-content> renders whatever the parent puts between the
// component's tags. `select` projects matching nodes into named slots; a bare
// <ng-content> is the default slot for everything else.
@Component({
  selector: 'app-card',
  template: `
    <section style="border:1px solid #ccc;border-radius:6px;padding:8px;margin:6px 0">
      <header style="font-weight:600">
        <ng-content select="[card-title]" />
      </header>
      <div>
        <ng-content />
      </div>
    </section>
  `,
})
export class CardComponent {}
