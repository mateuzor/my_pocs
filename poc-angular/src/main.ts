import { bootstrapApplication } from '@angular/platform-browser';
import { provideZonelessChangeDetection } from '@angular/core';
import { AppComponent } from './app/app.component';

// Angular 20 — ZONELESS change detection (stable in v20). We drop zone.js
// entirely: signals (and template events) schedule change detection directly,
// instead of zone.js monkey-patching every async API. Lighter and faster.
bootstrapApplication(AppComponent, {
  providers: [provideZonelessChangeDetection()],
}).catch((err) => console.error(err));
