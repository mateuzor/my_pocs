import { bootstrapApplication } from '@angular/platform-browser';
import { provideZonelessChangeDetection } from '@angular/core';
import { provideHttpClient } from '@angular/common/http';
import { provideRouter } from '@angular/router';
import { AppComponent } from './app/app.component';
import { routes } from './app/app.routes';

// Angular 20 — ZONELESS change detection (stable in v20). We drop zone.js
// entirely: signals (and template events) schedule change detection directly,
// instead of zone.js monkey-patching every async API. Lighter and faster.
bootstrapApplication(AppComponent, {
  providers: [
    provideZonelessChangeDetection(),
    provideRouter(routes),
    // provideHttpClient registers HttpClient app-wide (no HttpClientModule).
    provideHttpClient(),
  ],
}).catch((err) => console.error(err));
