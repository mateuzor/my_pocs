import { Component } from '@angular/core';

// Standalone by default in v20 — no `standalone: true`.
@Component({
  selector: 'app-home',
  template: `<p>🏠 Home — public route, anyone can see it.</p>`,
})
export class HomeComponent {}
