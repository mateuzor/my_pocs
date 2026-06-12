import { bootstrapApplication } from '@angular/platform-browser';
import { provideZonelessChangeDetection } from '@angular/core';
import { provideHttpClient, withInterceptors } from '@angular/common/http';
import { provideRouter } from '@angular/router';
import { AppComponent } from './app/app.component';
import { routes } from './app/app.routes';
import { authInterceptor } from './app/features/http/auth.interceptor';
import { APP_CONFIG } from './app/features/extras/app-config.token';

// Angular 20 — ZONELESS change detection (stable in v20). We drop zone.js
// entirely: signals (and template events) schedule change detection directly,
// instead of zone.js monkey-patching every async API. Lighter and faster.
bootstrapApplication(AppComponent, {
  providers: [
    provideZonelessChangeDetection(),
    provideRouter(routes),
    // provideHttpClient registers HttpClient app-wide (no HttpClientModule).
    // withInterceptors wires functional interceptors into every request.
    provideHttpClient(withInterceptors([authInterceptor])),
    // Override the token's default factory with real config via useValue.
    { provide: APP_CONFIG, useValue: { apiUrl: 'https://api.poc.dev', featureX: true } },
  ],
}).catch((err) => console.error(err));
