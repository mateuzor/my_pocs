import { Routes } from '@angular/router';

// `loadComponent` lazy-loads a standalone component as its own chunk — the
// dashboard code isn't downloaded until the user navigates there.
export const routes: Routes = [
  {
    path: '',
    loadComponent: () => import('./pages/home.component').then((m) => m.HomeComponent),
  },
  {
    path: 'dashboard',
    loadComponent: () =>
      import('./pages/dashboard.component').then((m) => m.DashboardComponent),
  },
];
