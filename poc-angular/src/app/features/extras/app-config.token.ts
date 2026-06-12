import { InjectionToken } from '@angular/core';

export interface AppConfig {
  apiUrl: string;
  featureX: boolean;
}

// An InjectionToken lets you inject things that have no class to use as a key
// (interfaces, plain objects, primitives). The `factory` provides a default —
// `providedIn: 'root'` makes it tree-shakable. A provider can override it later.
export const APP_CONFIG = new InjectionToken<AppConfig>('APP_CONFIG', {
  providedIn: 'root',
  factory: () => ({ apiUrl: 'https://default.example.com', featureX: false }),
});
